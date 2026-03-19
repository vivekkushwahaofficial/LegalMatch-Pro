package com.legalmatch.backend.service;

import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.ProfileUpdateRequest;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileResponse getMyProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse response = new ProfileResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
    }

    public ProfileResponse updateMyProfile(String email, ProfileUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update common fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }

        // lawyer updates
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

        // NGO updates
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

        userRepository.save(user);

        ProfileResponse response = new ProfileResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        return response;
    }

    User getCurrentUser() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}