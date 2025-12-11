package com.hackathon.talentquest.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.hackathon.talentquest.model.JobPosition;
import com.hackathon.talentquest.model.Student;

@Service
public class MatchingService {

    /**
     * Calcula o "Fit Cultural/Técnico" entre um ESTUDANTE e uma Vaga.
     * Retorna 0.0 a 100.0.
     */
    public double calculateMatch(Student student, JobPosition job) {
        Map<String, Integer> requiredSkills = job.getRequiredProfile();
        // Agora pegamos do objeto Student específico
        Map<String, Integer> studentSkills = student.getSkillsProfile(); 

        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 100.0; 
        }

        if (studentSkills == null) {
            return 0.0;
        }

        double totalGap = 0.0;
        int criteriaCount = 0;

        for (Map.Entry<String, Integer> req : requiredSkills.entrySet()) {
            String skillName = req.getKey();
            Integer targetLevel = req.getValue();
            
            Integer studentLevel = studentSkills.getOrDefault(skillName, 0);

            double gap = Math.abs(targetLevel - studentLevel);
            
            // Penalização máxima de gap = 10
            if (gap > 10) gap = 10;

            totalGap += gap;
            criteriaCount++;
        }

        if (criteriaCount == 0) return 100.0;

        double averageGap = totalGap / criteriaCount;

        // Fórmula: 100 - (Gap Médio * 10)
        double score = 100.0 - (averageGap * 10.0);

        return Math.max(0.0, score);
    }
}