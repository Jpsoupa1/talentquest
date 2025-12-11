package com.hackathon.talentquest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.talentquest.dto.ChallengeRequest;
import com.hackathon.talentquest.dto.JobRequest;
import com.hackathon.talentquest.model.Challenge;
import com.hackathon.talentquest.model.Company;
import com.hackathon.talentquest.model.JobPosition;
import com.hackathon.talentquest.repository.ChallengeRepository;
import com.hackathon.talentquest.repository.CompanyRepository;
import com.hackathon.talentquest.repository.JobPositionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobPositionRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ChallengeRepository challengeRepository;

    @GetMapping
    public List<JobPosition> getAllJobs() {
        return jobRepository.findAll();
    }

    // --- NOVO: CRIAR VAGA (Só Empresas) ---
    @PostMapping
    public ResponseEntity<JobPosition> createJob(@RequestBody JobRequest request) {
        // Busca especificamente no repositório de Empresas
        Company company = companyRepository.findById(request.companyId())
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        JobPosition job = JobPosition.builder()
                .title(request.title())
                .description(request.description())
                .company(company) // Passa o objeto Company
                .requiredProfile(request.requiredProfile())
                .build();

        return ResponseEntity.ok(jobRepository.save(job));
    }

    // --- NOVO: ADICIONAR DESAFIO À VAGA ---
    @PostMapping("/{jobId}/challenges")
    public ResponseEntity<Challenge> addChallenge(@PathVariable Long jobId, @RequestBody ChallengeRequest request) {
        JobPosition job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));

        Challenge challenge = Challenge.builder()
                .title(request.title())
                .problemStatement(request.problemStatement())
                .inputSample(request.inputSample())
                .outputExpected(request.outputExpected())
                .jobPosition(job)
                .build();

        return ResponseEntity.ok(challengeRepository.save(challenge));
    }
}