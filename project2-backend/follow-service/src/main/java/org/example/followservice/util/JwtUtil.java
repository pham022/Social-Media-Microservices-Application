package org.example.followservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private final byte[] keyBytes;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    }

    public Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object userIdObj = claims.get("userId");
        if (userIdObj == null) {
            userIdObj = claims.get("id");
        }

        if (userIdObj == null) {
            throw new IllegalArgumentException("Missing userId/id claim");
        }

        if (userIdObj instanceof Integer i) return i.longValue();
        if (userIdObj instanceof Long l) return l;
        return Long.parseLong(userIdObj.toString());
    }
    }
