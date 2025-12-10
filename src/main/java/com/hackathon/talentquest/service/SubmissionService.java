package com.hackathon.talentquest.service;

import org.springframework.stereotype.Service;

import com.hackathon.talentquest.model.Challenge;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.model.User;
import com.hackathon.talentquest.model.enums.SubmissionStatus;
import com.hackathon.talentquest.repository.ChallengeRepository;
import com.hackathon.talentquest.repository.SubmissionRepository;
import com.hackathon.talentquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Cria construtor automático para injetar os Repositories
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    public Submission evaluateSubmission(Long studentId, Long challengeId, String codeSubmitted) {
        // 1. Buscar Entidades no Banco
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado"));
        
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado"));

        // 2. Criar objeto de Submissão
        Submission submission = Submission.builder()
                .student(student)
                .challenge(challenge)
                .codeSubmitted(codeSubmitted)
                .build();

        // 3. Validação Técnica (Simulação de compilador)
        // Aqui comparamos a saída esperada com a lógica do aluno (mockada para o Hackathon)
        // Num cenário real, rodaríamos o código de verdade.
        // Regra simples: Se o código contiver a resposta esperada, passa.
        boolean technicalSuccess = simulateCodeExecution(codeSubmitted, challenge.getOutputExpected());

        if (technicalSuccess) {
            submission.setStatus(SubmissionStatus.SUCCESS);
            
            // 4. Calcular Score Final (Técnico + Cultural)
            double culturalScore = matchingService.calculateCulturalMatch(student, challenge.getJobPosition());
            
            // Peso: 40% Técnico (já passou), 60% Cultural
            // Como passou no técnico, assumimos nota 100 técnica
            double finalScore = (100.0 * 0.4) + (culturalScore * 0.6);
            
            submission.setScore(finalScore);
        } else {
            submission.setStatus(SubmissionStatus.FAILED);
            submission.setScore(0.0);
        }

        return submissionRepository.save(submission);
    }

    private boolean simulateCodeExecution(String code, String expectedOutput) {
        // Verifica se o código não está vazio e se (num caso real) bateria com o output.
        // Para testar fácil: vamos considerar SUCESSO se o código contiver a palavra "return" 
        // ou se o usuário digitar exatamente o output esperado como comentário.
        if (code == null) return false;
        return code.contains(expectedOutput) || code.contains("return");
    }
}