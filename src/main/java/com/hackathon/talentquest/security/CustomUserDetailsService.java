package com.hackathon.talentquest.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hackathon.talentquest.model.User;
import com.hackathon.talentquest.repository.UserRepository; // <--- ESTE É O IMPORT QUE CRIA O BEAN

import lombok.RequiredArgsConstructor;

@Service // <--- ESSA ANOTAÇÃO É OBRIGATÓRIA PARA RESOLVER SEU ERRO
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    // Usamos o UserRepository genérico, pois ele acha tanto Student quanto Company
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + email));

        // Converte nosso User do banco para o User do Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()))
        );
    }
}