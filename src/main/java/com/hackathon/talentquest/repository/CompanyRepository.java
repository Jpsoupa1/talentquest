package com.hackathon.talentquest.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.Company; // <--- Importe isso

public interface CompanyRepository extends JpaRepository<Company, Long> {
    // ADICIONE ESTA LINHA:
    Optional<Company> findByEmail(String email);
}