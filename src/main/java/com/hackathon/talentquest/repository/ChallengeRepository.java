package com.hackathon.talentquest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackathon.talentquest.model.Challenge;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
}