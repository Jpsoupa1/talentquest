package com.hackathon.talentquest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.talentquest.dto.JwtAuthResponse;
import com.hackathon.talentquest.dto.LoginRequest;
import com.hackathon.talentquest.dto.RegisterRequest;
import com.hackathon.talentquest.dto.SubmissionResponse;
import com.hackathon.talentquest.model.Company;
import com.hackathon.talentquest.model.Student;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.model.User;
import com.hackathon.talentquest.model.enums.UserType;
import com.hackathon.talentquest.repository.CompanyRepository;
import com.hackathon.talentquest.repository.StudentRepository;
import com.hackathon.talentquest.repository.SubmissionRepository;
import com.hackathon.talentquest.repository.UserRepository;
import com.hackathon.talentquest.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final SubmissionRepository submissionRepository;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.email()).orElseThrow();

        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(token);
        response.setUserType(user.getUserType().toString());
        response.setName(user.getName());
        response.setId(user.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Erro: Email já está em uso!");
        }

        UserType type = UserType.valueOf(request.userType().toUpperCase());
        String encodedPassword = passwordEncoder.encode(request.password());

        // LÓGICA DE INSTANCIAÇÃO POLIMÓRFICA
        if (type == UserType.STUDENT) {
            Student student = new Student();
            student.setName(request.name());
            student.setEmail(request.email());
            student.setPassword(encodedPassword);
            student.setUserType(UserType.STUDENT);
            student.setSkillsProfile(new HashMap<>()); // Inicia vazio
            studentRepository.save(student);
        } else {
            Company company = new Company();
            company.setName(request.name());
            company.setEmail(request.email());
            company.setPassword(encodedPassword);
            company.setUserType(UserType.COMPANY);
            company.setDescription("Nova empresa cadastrada");
            companyRepository.save(company);
        }

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByJob(@PathVariable Long jobId) {
        List<Submission> submissions = submissionRepository.findByChallengeJobPositionId(jobId);
        
        // Converte para DTO
        List<SubmissionResponse> response = submissions.stream()
                .map(SubmissionResponse::new)
                // Ordena por maior nota primeiro (Ranking)
                .sorted((s1, s2) -> s2.getScore().compareTo(s1.getScore()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String filename) throws java.io.IOException {
        java.nio.file.Path path = java.nio.file.Paths.get("uploads").resolve(filename);
        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(path.toUri());
        
        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}