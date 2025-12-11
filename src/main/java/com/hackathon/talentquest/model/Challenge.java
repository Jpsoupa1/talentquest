package com.hackathon.talentquest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "challenges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String problemStatement;
    private String inputSample;
    private String outputExpected;

    // --- ESTA PARTE É A MAIS IMPORTANTE ---
    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnore // Evita loop infinito ao buscar Vaga -> Desafios
    private JobPosition jobPosition; // O nome TEM que ser jobPosition
    // --------------------------------------
}