package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;

    private final BCryptPasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Set role from frontend
        if (request.getRole().equalsIgnoreCase("LAWYER")) {
            user.setRole(Role.LAWYER);
        } else if (request.getRole().equalsIgnoreCase("NGO")) {
            user.setRole(Role.NGO);
        } else {
            user.setRole(Role.CITIZEN);
        }        userRepository.save(user);

       // 🔥 Cleaner approach
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

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    @PostMapping("/refresh-token")
    public Map<String, String> refreshToken(@RequestBody Map<String, String> request) {

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

        return response;
    }
}
