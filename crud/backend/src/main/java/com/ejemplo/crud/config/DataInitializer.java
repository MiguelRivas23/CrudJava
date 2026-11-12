package com.ejemplo.crud.config;

import com.ejemplo.crud.model.Usuario;
import com.ejemplo.crud.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Al arrancar, crea admin / pass si no existe. En la tabla queda guardado el hash BCrypt, no "pass".
    @Bean
    public CommandLineRunner crearUsuarioInicial(UsuarioRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (!repository.existsByUsername("admin")) {
                repository.save(new Usuario("admin", encoder.encode("pass")));
            }
        };
    }
}
