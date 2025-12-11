package com.hackathon.talentquest.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hackathon.talentquest.model.Challenge;
import com.hackathon.talentquest.model.Company;
import com.hackathon.talentquest.model.JobPosition;
import com.hackathon.talentquest.model.Student;
import com.hackathon.talentquest.model.Submission;
import com.hackathon.talentquest.model.enums.SubmissionStatus;
import com.hackathon.talentquest.model.enums.UserType;
import com.hackathon.talentquest.repository.ChallengeRepository;
import com.hackathon.talentquest.repository.CompanyRepository;
import com.hackathon.talentquest.repository.JobPositionRepository;
import com.hackathon.talentquest.repository.StudentRepository;
import com.hackathon.talentquest.repository.SubmissionRepository;
import com.hackathon.talentquest.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobPositionRepository jobRepository;
    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            System.out.println("🧹 LIMPANDO BANCO DE DADOS (RESET TOTAL)...");
            // Ordem importa para não quebrar chaves estrangeiras
            submissionRepository.deleteAll();
            challengeRepository.deleteAll();
            jobRepository.deleteAll();
            studentRepository.deleteAll();
            companyRepository.deleteAll();
            userRepository.deleteAll(); // Garante limpeza total

            System.out.println("🌱 CRIANDO DADOS DO ZERO (CENÁRIO DEMO)...");

            // 1. EMPRESA
            Company techCorp = new Company();
            techCorp.setName("Tech Corp Solutions");
            techCorp.setEmail("rh@tech.com");
            techCorp.setPassword(passwordEncoder.encode("123456"));
            techCorp.setUserType(UserType.COMPANY);
            techCorp.setDescription("Líder global em soluções financeiras.");
            techCorp.setIndustry("FinTech");
            companyRepository.save(techCorp);

            // 2. VAGA (Job)
            JobPosition javaJob = new JobPosition();
            javaJob.setTitle("Dev Java Júnior");
            javaJob.setDescription("Vaga para atuar com microsserviços, Spring Boot e APIs RESTful.");
            javaJob.setCompany(techCorp);
            Map<String, Integer> reqSkills = new HashMap<>();
            reqSkills.put("Java", 8);
            reqSkills.put("Spring Boot", 7);
            javaJob.setRequiredProfile(reqSkills);
            jobRepository.save(javaJob);

            // 3. DESAFIO (Challenge)
            Challenge challenge = new Challenge();
            challenge.setTitle("Inverter String");
            challenge.setProblemStatement("Crie uma função que receba uma palavra e inverta a ordem das letras.");
            challenge.setInputSample("Casa");
            challenge.setOutputExpected("asaC");
            challenge.setJobPosition(javaJob);
            challengeRepository.save(challenge);

            // 4. ESTUDANTES
            // João (Candidato Ideal)
            Student joao = new Student();
            joao.setName("João Java");
            joao.setEmail("joao@student.com");
            joao.setPassword(passwordEncoder.encode("123456"));
            joao.setUserType(UserType.STUDENT);
            Map<String, Integer> skillsJoao = new HashMap<>();
            skillsJoao.put("Java", 9);
            skillsJoao.put("Spring Boot", 8);
            joao.setSkillsProfile(skillsJoao);
            studentRepository.save(joao);

            // Maria (Match Baixo)
            Student maria = new Student();
            maria.setName("Maria Frontend");
            maria.setEmail("maria@student.com");
            maria.setPassword(passwordEncoder.encode("123456"));
            maria.setUserType(UserType.STUDENT);
            Map<String, Integer> skillsMaria = new HashMap<>();
            skillsMaria.put("React", 9);
            skillsMaria.put("Java", 3);
            maria.setSkillsProfile(skillsMaria);
            studentRepository.save(maria);

            // 5. SUBMISSÕES (CANDIDATOS APLICANDO)
            System.out.println("🚀 GERANDO SUBMISSÕES...");

            // João aplica (Sucesso)
            Submission subJoao = Submission.builder()
                    .student(joao)
                    .challenge(challenge)
                    .codeSubmitted("public class Main { ... }")
                    .score(96.5)
                    .status(SubmissionStatus.SUCCESS)
                    .build();
            submissionRepository.save(subJoao);

            // Maria aplica (Nota Baixa)
            Submission subMaria = Submission.builder()
                    .student(maria)
                    .challenge(challenge)
                    .codeSubmitted("console.log('erro')")
                    .score(42.0)
                    .status(SubmissionStatus.SUCCESS)
                    .build();
            submissionRepository.save(subMaria);

            System.out.println("✅ BANCO POPULADO! JOÃO E MARIA CRIADOS.");
        };
    }
}