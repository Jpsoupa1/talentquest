package com.hackathon.talentquest.dto;

import java.util.Map;

public record JobRequest(
    String title, 
    String description, 
    Long companyId, 
    Map<String, Integer> requiredProfile
) {}