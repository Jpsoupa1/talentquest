package com.hackathon.talentquest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentId(Long studentId);
    
    List<Submission> findByChallengeId(Long challengeId);
}