package com.hackathon.talentquest.dto;

public record ChallengeRequest(
    String title,
    String problemStatement,
    String inputSample,
    String outputExpected,
    Long jobId
) {}