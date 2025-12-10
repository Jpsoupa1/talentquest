package com.hackathon.talentquest.config;

import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import com.hackathon.talentquest.model.Challenge;
import com.hackathon.talentquest.model.JobPosition;
import com.hackathon.talentquest.model.User;
import com.hackathon.talentquest.model.enums.UserType;
import com.hackathon.talentquest.repository.ChallengeRepository;
import com.hackathon.talentquest.repository.JobPositionRepository;
import com.hackathon.talentquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobPositionRepository jobRepository;
    private final ChallengeRepository challengeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Evita duplicar dados se reiniciar a aplicação (para H2 em memória não precisa, mas é boa prática)
        if (userRepository.count() > 0) return;


        User company = User.builder()
                .name("Tech Corp Solutions")
                .email("rh@techcorp.com")
                .password("123456") 
                .userType(UserType.COMPANY)
                .build();
        userRepository.save(company);

        User student = User.builder()
                .name("João Developer")
                .email("joao@student.com")
                .password("123456")
                .userType(UserType.STUDENT)
                .skillsProfile(Map.of(
                        "Java", 8,
                        "Spring Boot", 6,
                        "Trabalho em Equipe", 9,
                        "Comunicação", 7
                ))
                .build();
        userRepository.save(student);

        JobPosition job = JobPosition.builder()
                .title("Desenvolvedor Java Junior")
                .description("Estamos buscando talentos para inovar no setor financeiro.")
                .company(company)
                .requiredProfile(Map.of(
                        "Java", 5,
                        "Trabalho em Equipe", 8,
                        "Inglês", 4
                ))
                .build();
        jobRepository.save(job);


        Challenge challenge = Challenge.builder()
                .title("Soma Simples")
                .problemStatement("Crie uma função que receba dois números e retorne a soma. Exemplo: input '2 3', output '5'.")
                .inputSample("10 20")
                .outputExpected("30")
                .jobPosition(job)
                .build();
        challengeRepository.save(challenge);

        System.out.println("✅ BANCO DE DADOS POPULADO COM SUCESSO!");
    }
}