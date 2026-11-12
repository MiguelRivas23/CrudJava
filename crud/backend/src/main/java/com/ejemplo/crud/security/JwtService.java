package com.ejemplo.crud.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generarToken(String usuario) {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .subject(usuario)
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + expirationMs))
                .signWith(key)
                .compact();
    }

    /** Devuelve el usuario del token, o vacío si el token es inválido o expiró. */
    public Optional<String> usuarioDe(String token) {
        try {
            String usuario = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            return Optional.ofNullable(usuario);
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
