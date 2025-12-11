package com.hackathon.talentquest.config;

import java.time.LocalDateTime;
import java.util.Collections;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hackathon.talentquest.model.User;
import com.hackathon.talentquest.model.enums.UserType;
import com.hackathon.talentquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            if (userRepository.findByEmail("student@talentquest.com").isEmpty()) {
                User student = new User();
                student.setName("Student User");
                student.setEmail("student@talentquest.com");
                student.setPassword(passwordEncoder.encode("password"));
                student.setUserType(UserType.STUDENT);
                student.setCreatedAt(LocalDateTime.now());
                student.setSkillsProfile(Collections.emptyMap());
                
                userRepository.save(student);
                System.out.println("Seeded student user: student@talentquest.com / password");
            }
        };
    }
}
