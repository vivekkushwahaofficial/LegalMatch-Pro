package com.legalmatch.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.ForgotPasswordRequest;
import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RefreshTokenRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.dto.ResetPasswordRequest;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;

@Service
public class AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${app.auth.admin-invite-code:}")
    private String adminInviteCode;

    public AuthService(UserRepository userRepository,
            LawyerProfileRepository lawyerProfileRepository,
            NgoProfileRepository ngoProfileRepository,
            JwtService jwtService,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.ngoProfileRepository = ngoProfileRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        // Step 1: Check email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Step 2: Decide role
        Role role = parseRole(request.getRole());

        if (role == Role.ADMIN) {
            boolean hasConfiguredInvite = adminInviteCode != null && !adminInviteCode.isBlank();
            boolean inviteMatches = hasConfiguredInvite
                    && Objects.equals(adminInviteCode, request.getAdminInviteCode());

            if (!inviteMatches) {
                throw new RuntimeException("Admin registration is not allowed");
            }
        }

        // Step 3: Validate BEFORE saving
        if (role == Role.LAWYER) {
            if (request.getSpecialization() == null || request.getSpecialization().isBlank()
                    || request.getLocation() == null || request.getLocation().isBlank()) {

                throw new RuntimeException("Specialization and location required for lawyer");
            }
        }

        // Step 4: Create user ONLY ONCE
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setSubmittedDate(LocalDateTime.now());
        user.setStatus(VerificationStatus.PENDING);
        user.setRole(role);

        // Step 5: Save user
        userRepository.save(user);

        // Step 6: Create profile
        if (role == Role.LAWYER) {
            LawyerProfile profile = new LawyerProfile();
            profile.setUser(user);
            profile.setSpecialization(request.getSpecialization());
            profile.setLocation(request.getLocation());
            profile.setVerified(false);

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
        tokens.put("userId", String.valueOf(user.getId()));

        return tokens;
    }

    public Map<String, String> refreshToken(RefreshTokenRequest request) {

        String refreshToken = request.getRefreshToken();

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
        response.put("role", user.getRole().name());
        response.put("userId", String.valueOf(user.getId()));

        return response;
    }

    private Role parseRole(String roleValue) {
        try {
            return Role.valueOf(roleValue.trim().toUpperCase());
        } catch (Exception ex) {
            throw new RuntimeException("Invalid role");
        }
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create short-lived reset token (15 minutes).
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Simulate email sending by logging the reset token.
        LOGGER.info("Password reset token for {} is {}", user.getEmail(), token);

        return "Reset link sent";
    }

    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password updated successfully";
    }
}
