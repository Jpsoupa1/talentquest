package com.hackathon.talentquest.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.hackathon.talentquest.model.JobPosition;
import com.hackathon.talentquest.model.User;

@Service
public class MatchingService {

    /**
     * Calcula o "Fit Cultural" (0 a 100%) baseado na distância entre 
     * o que o aluno tem e o que a vaga pede.
     */
    public double calculateCulturalMatch(User student, JobPosition job) {
        Map<String, Integer> requiredSkills = job.getRequiredProfile();
        Map<String, Integer> studentSkills = student.getSkillsProfile();

        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 100.0; // Se a vaga não exige nada, qualquer um serve
        }

        double totalGap = 0.0;
        int criteriaCount = 0;

        for (Map.Entry<String, Integer> req : requiredSkills.entrySet()) {
            String skillName = req.getKey();
            Integer targetLevel = req.getValue();
            
            // Se o aluno não tem a skill, consideramos nível 0
            Integer studentLevel = studentSkills.getOrDefault(skillName, 0);

            // Calculamos o 'Gap' (Distância)
            // Ex: Vaga pede 5, Aluno tem 3 -> Gap de 2
            double gap = Math.abs(targetLevel - studentLevel);
            
            // Limitamos o gap máximo a 10 para não distorcer a média
            if (gap > 10) gap = 10;

            totalGap += gap;
            criteriaCount++;
        }

        if (criteriaCount == 0) return 100.0;

        // Média de distância
        double averageGap = totalGap / criteriaCount;

        double score = 100.0 - (averageGap * 10.0);

        return Math.max(0.0, score); // Nunca retorna negativo
    }
}