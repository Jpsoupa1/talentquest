package com.hackathon.talentquest.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.JobPosition;

public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
    List<JobPosition> findByCompanyId(Long companyId);
  
    List<JobPosition> findByTitleContainingIgnoreCase(String title);
}