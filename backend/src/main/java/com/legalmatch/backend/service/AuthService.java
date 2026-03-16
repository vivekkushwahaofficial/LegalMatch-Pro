package com.legalmatch.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setSubmittedDate(LocalDateTime.now());
        user.setStatus(VerificationStatus.PENDING);

        if (request.getRole().equalsIgnoreCase("LAWYER")) {
            user.setRole(Role.LAWYER);

        } else if (request.getRole().equalsIgnoreCase("NGO")) {
            user.setRole(Role.NGO);

        } else if (request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole(Role.ADMIN);

        } else {
            user.setRole(Role.CITIZEN);
        }

        userRepository.save(user);

        Role role = user.getRole();

        if (role == Role.LAWYER) {

            LawyerProfile profile = new LawyerProfile();
            profile.setUser(user);

            lawyerProfileRepository.save(profile);
        }

        if (role == Role.NGO) {

            NgoProfile profile = new NgoProfile();
            profile.setUser(user);

            ngoProfileRepository.save(profile);
        }

        return "User registered successfully";
    }

    public Map<String, String> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        Map<String, String> tokens = new HashMap<>();

        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("role", user.getRole().name());
        tokens.put("name", user.getName());

        return tokens;
    }

    public Map<String, String> refreshToken(Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtService.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        Map<String, String> response = new HashMap<>();

        response.put("accessToken", newAccessToken);
        response.put("name", user.getName());

        return response;
    }
}
