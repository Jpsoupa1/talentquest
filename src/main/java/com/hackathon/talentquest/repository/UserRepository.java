package com.hackathon.talentquest.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.User;

// Repositório Genérico (Para Login)
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}