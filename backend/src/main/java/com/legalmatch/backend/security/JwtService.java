package com.legalmatch.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String SECRET_KEY = "my-super-secret-key-my-super-secret-key";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generate Access Token with ROLE
    public String generateAccessToken(String email, String role) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);   // 👈 add role inside token

        return Jwts.builder()
                .setClaims(claims)                          // put custom data
                .setSubject(email)                          // email as subject
                .setIssuedAt(new Date())                    // token create time
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60))  // 1 hour expiry
                .signWith(key)                              // sign token with secret key
                .compact();                                 // build token
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)) //24 hours expiry
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);  // 👈 get role from token
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
