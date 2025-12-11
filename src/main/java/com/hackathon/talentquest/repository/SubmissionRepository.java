package com.hackathon.talentquest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importe o Query
import org.springframework.data.repository.query.Param; // Importe o Param

import com.hackathon.talentquest.model.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    // Vamos usar @Query para ter 100% de certeza que o JOIN está certo
    @Query("SELECT s FROM Submission s WHERE s.challenge.jobPosition.id = :jobId")
    List<Submission> findByChallengeJobPositionId(@Param("jobId") Long jobId);
    
    @Query("SELECT s FROM Submission s WHERE s.challenge.jobPosition.id = :jobId")
    List<Submission> findSubmissionsByJobId(@Param("jobId") Long jobId);
}