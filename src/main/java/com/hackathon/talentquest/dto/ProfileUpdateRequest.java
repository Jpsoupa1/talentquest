package com.hackathon.talentquest.dto;

import java.util.Map;

public record ProfileUpdateRequest(
    Long userId,
    Map<String, Integer> skills
) {}