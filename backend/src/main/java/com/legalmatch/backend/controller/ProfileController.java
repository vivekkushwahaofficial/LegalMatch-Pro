package com.legalmatch.backend.controller;
import com.legalmatch.backend.dto.ProfileUpdateRequest;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ProfileResponse getMyProfile(Authentication authentication) {

        // 1. Get email from JWT (Spring Security context)
        String email = authentication.getName();

        // 2. Fetch user from DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Map User -> ProfileResponse DTO
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        // 4. Return safe profile data
        return response;
    }
    @PutMapping("/update")
    public ProfileResponse updateMyProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {
        // 1. Get logged-in user's email from JWT
        String email = authentication.getName();

        // 2. Fetch user from database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Update common fields (for all roles)
        if (request.getName() != null) {
            user.setName(request.getName());
        }

        // 4. Role-based update
        if (user.getRole().name().equals("LAWYER")) {
            if (user.getLawyerProfile() != null) {
                if (request.getSpecialization() != null) {
                    user.getLawyerProfile().setSpecialization(request.getSpecialization());
                }
                if (request.getLicenseNumber() != null) {
                    user.getLawyerProfile().setLicenseNumber(request.getLicenseNumber());
                }
            }

        }

        if (user.getRole().name().equals("NGO")) {
            if (user.getNgoProfile() != null) {

                if (request.getNgoName() != null) {
                    user.getNgoProfile().setNgoName(request.getNgoName());
                }

                if (request.getRegistrationNumber() != null) {
                    user.getNgoProfile().setRegistrationNumber(request.getRegistrationNumber());
                }
            }
        }


        // 5. Save updated user
        userRepository.save(user);

        // 6. Prepare response DTO
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;

    }

}
