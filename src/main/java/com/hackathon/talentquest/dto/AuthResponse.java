package com.hackathon.talentquest.dto;

public record AuthResponse(String accessToken, String tokenType, String email, String name) {
    public AuthResponse(String accessToken, String email, String name) {
        this(accessToken, "Bearer", email, name);
    }
}
