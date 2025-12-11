package com.hackathon.talentquest.service;

import org.springframework.stereotype.Service;

import com.hackathon.talentquest.model.Challenge;
import com.hackathon.talentquest.model.Student;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.model.enums.SubmissionStatus;
import com.hackathon.talentquest.repository.ChallengeRepository;
import com.hackathon.talentquest.repository.StudentRepository;
import com.hackathon.talentquest.repository.SubmissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ChallengeRepository challengeRepository;
    private final StudentRepository studentRepository;
    private final MatchingService matchingService;

    public Submission evaluateSubmission(Long studentId, Long challengeId, String codeSubmitted) {
        
        // 1. Validações
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado."));
        
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado."));

        // 2. Cálculo da Nota Técnica (0 a 40 pontos)
        // O "Compilador Heurístico" analisa a qualidade do código
        double technicalScore = calculateTechnicalScore(codeSubmitted, challenge.getOutputExpected());
        
        // Define status baseado na nota técnica
        SubmissionStatus status = technicalScore >= 20.0 ? SubmissionStatus.SUCCESS : SubmissionStatus.FAILED;

        // 3. Cálculo do Match Cultural (0 a 60 pontos)
        double culturalScore = matchingService.calculateMatch(student, challenge.getJobPosition());
        
        // Ajuste: O cultural vale 60% da nota final (0.6 * 100 = 60 max)
        double weightedCulturalScore = culturalScore * 0.6;

        // 4. Nota Final (Soma Técnica + Cultural)
        double finalScore = technicalScore + weightedCulturalScore;
        
        // Arredonda para 1 casa decimal e limita a 100
        finalScore = Math.min(100.0, Math.round(finalScore * 10.0) / 10.0);

        // 5. Salva
        Submission submission = Submission.builder()
                .student(student)
                .challenge(challenge)
                .codeSubmitted(codeSubmitted)
                .score(finalScore)
                .status(status)
                .build();

        return submissionRepository.save(submission);
    }

    /**
     * SIMULADOR DE COMPILADOR (HEURÍSTICA)
     * Analisa se o código parece uma solução Java válida.
     * Retorna de 0.0 a 40.0 pontos.
     */
    private double calculateTechnicalScore(String code, String expectedOutput) {
        if (code == null || code.trim().isEmpty()) return 0.0;
        
        double score = 0.0;
        String cleanCode = code.replaceAll("\\s+", " "); // Remove espaços extras para facilitar busca

        // CRITÉRIO 1: Estrutura Java Básica (Vale 10 pontos)
        if (cleanCode.contains("public class") || cleanCode.contains("class Main")) {
            score += 5.0;
        }
        if (cleanCode.contains("public static void main")) {
            score += 5.0;
        }

        // CRITÉRIO 2: Saída de Dados (Vale 10 pontos)
        // O código precisa tentar imprimir algo
        if (cleanCode.contains("System.out.println") || cleanCode.contains("return")) {
            score += 10.0;
        }

        // CRITÉRIO 3: Lógica Algorítmica (Vale 10 pontos)
        // Verifica se usou loops, condicionais ou manipulação de objetos
        if (cleanCode.contains("for (") || cleanCode.contains("while (") || 
            cleanCode.contains("if (") || cleanCode.contains("new StringBuilder")) {
            score += 10.0;
        }

        // CRITÉRIO 4: Lógica Específica do Desafio (Vale 10 pontos)
        // Para o desafio "Inverter String", procuramos termos chave
        // Se o aluno usou .reverse(), .charAt(), .length() ou array
        if (cleanCode.contains(".reverse()") || 
            cleanCode.contains(".charAt(") || 
            cleanCode.contains(".length()") || 
            cleanCode.contains("toCharArray()")) {
            score += 10.0;
        }

        // BÔNUS/PENALIDADE: Hardcode
        // Se o código contém EXATAMENTE a resposta esperada (ex: "asaC"), 
        // mas NÃO tem lógica (score baixo), é suspeito. 
        // Mas se tiver lógica, é sinal de que ele imprimiu o resultado certo.
        if (cleanCode.contains("\"" + expectedOutput + "\"") && score < 20) {
            // Penalidade: Hardcode sem lógica
            score = 10.0; 
        }

        return Math.min(40.0, score);
    }
}