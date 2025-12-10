package com.hackathon.talentquest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.talentquest.dto.LoginRequest;
import com.hackathon.talentquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.email())
                .map(user -> {

                    if (user.getPassword().equals(request.password())) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).body("Senha incorreta");
                })
                .orElse(ResponseEntity.status(404).body("Usuário não encontrado"));
    }
}