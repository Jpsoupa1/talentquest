package com.hackathon.talentquest.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hackathon.talentquest.dto.ProfileUpdateRequest;
import com.hackathon.talentquest.model.Student;
import com.hackathon.talentquest.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final Path uploadPath = Paths.get("uploads");

    // Atualizar Skills (Currículo Técnico)
    @PutMapping("/{id}/profile")
    public ResponseEntity<Student> updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado"));

        student.setSkillsProfile(request.skills());
        
        return ResponseEntity.ok(studentRepository.save(student));
    }

    // Upload de Currículo PDF
    @PostMapping("/{id}/resume")
    public ResponseEntity<String> uploadResume(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Estudante não encontrado (apenas estudantes têm currículo)"));

            String filename = "cv_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            
            Files.copy(file.getInputStream(), filePath);

            student.setResumeUrl(filename);
            studentRepository.save(student);

            return ResponseEntity.ok("Upload realizado com sucesso!");

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao salvar arquivo.");
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}