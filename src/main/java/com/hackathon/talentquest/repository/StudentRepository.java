package com.hackathon.talentquest.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.Student; // <--- Importe isso

public interface StudentRepository extends JpaRepository<Student, Long> {
    // ADICIONE ESTA LINHA:
    Optional<Student> findByEmail(String email);
}