package com.hackathon.talentquest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    
    // ESTES CAMPOS SÃO OBRIGATÓRIOS PARA O FRONT FUNCIONAR:
    private String userType;  // <--- Verifique se isso existe
    private String name;      // <--- E isso
    private Long id;
}