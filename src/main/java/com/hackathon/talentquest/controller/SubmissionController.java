package com.hackathon.talentquest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // Import novo
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.talentquest.dto.SubmissionRequest;
import com.hackathon.talentquest.dto.SubmissionResponse;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.repository.SubmissionRepository;
import com.hackathon.talentquest.service.SubmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final SubmissionRepository submissionRepository;

    @PostMapping
    public ResponseEntity<SubmissionResponse> submitCode(@RequestBody SubmissionRequest request) {
        try {
            // 1. Processa a lógica
            Submission submission = submissionService.evaluateSubmission(
                    request.studentId(),
                    request.challengeId(),
                    request.code()
            );
            
            // 2. Converte para o DTO Limpo antes de devolver
            SubmissionResponse response = new SubmissionResponse(submission);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByJob(@PathVariable Long jobId) {
        // LOG DE DEBUG (Olhe no terminal do Java quando clicar no botão)
        System.out.println("🔍 Buscando candidatos para a Vaga ID: " + jobId);

        // Usa o método novo do repositório
        List<Submission> submissions = submissionRepository.findSubmissionsByJobId(jobId);
        
        System.out.println("✅ Encontrados: " + submissions.size() + " candidatos.");

        List<SubmissionResponse> response = submissions.stream()
                .map(SubmissionResponse::new)
                .sorted((s1, s2) -> s2.getScore().compareTo(s1.getScore()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/debug")
    public ResponseEntity<List<SubmissionResponse>> getAllDebug() {
        return ResponseEntity.ok(
            submissionRepository.findAll().stream()
                .map(SubmissionResponse::new)
                .collect(Collectors.toList())
        );
    }

}