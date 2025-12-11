package com.hackathon.talentquest.dto;

import com.hackathon.talentquest.model.Submission;

import lombok.Data;

@Data
public class SubmissionResponse {
    private Long id;
    private String status;
    private Double score;
    private String feedback;
    private String studentName;
    private String studentEmail; // <--- NOVO
    private String resumeUrl;    // <--- NOVO
    private String challengeTitle;

    public SubmissionResponse(Submission submission) {
        this.id = submission.getId();
        this.status = submission.getStatus().toString();
        this.score = submission.getScore();
        this.studentName = submission.getStudent().getName();
        this.studentEmail = submission.getStudent().getEmail();     // <--- Mapear
        this.resumeUrl = submission.getStudent().getResumeUrl();    // <--- Mapear
        this.challengeTitle = submission.getChallenge().getTitle();
        
        if (this.score >= 90) {
            this.feedback = "Excelente Match! Perfil técnico e cultural alinhados.";
        } else if (this.score >= 70) {
            this.feedback = "Aprovado! Bom desempenho técnico.";
        } else {
            this.feedback = "Score abaixo do esperado para esta vaga.";
        }
    }
}