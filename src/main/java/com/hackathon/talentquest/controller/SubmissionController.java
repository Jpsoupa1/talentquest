package com.hackathon.talentquest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.talentquest.dto.SubmissionRequest;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.service.SubmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitCode(@RequestBody SubmissionRequest request) {
        try {

            Submission result = submissionService.evaluateSubmission(
                    request.studentId(),
                    request.challengeId(),
                    request.code()
            );
            return ResponseEntity.ok(result);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}