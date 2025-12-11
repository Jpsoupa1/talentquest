package com.hackathon.talentquest.dto;

// Usamos String para o userType para facilitar o JSON, depois convertemos para Enum
public record RegisterRequest(String name, String email, String password, String userType) {}