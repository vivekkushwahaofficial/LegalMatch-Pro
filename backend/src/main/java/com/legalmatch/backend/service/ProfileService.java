package com.legalmatch.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.ProfileUpdateRequest;
import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.UserRepository;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getMyProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToResponse(user);
    }

    public ProfileResponse updateMyProfile(String email, ProfileUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update common fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }

        // lawyer updates
        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
            LawyerProfile lp = user.getLawyerProfile();
            if (request.getSpecialization() != null) lp.setSpecialization(request.getSpecialization());
            if (request.getLicenseNumber() != null) lp.setLicenseNumber(request.getLicenseNumber());
            if (request.getLocation() != null) lp.setLocation(request.getLocation());
        }

        // NGO updates
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            NgoProfile np = user.getNgoProfile();
            if (request.getNgoName() != null) np.setNgoName(request.getNgoName());
            if (request.getRegistrationNumber() != null) np.setRegistrationNumber(request.getRegistrationNumber());
            if (request.getLocation() != null) np.setLocation(request.getLocation());
            if (request.getSpecialization() != null) np.setSpecialization(request.getSpecialization());
        }

        userRepository.save(user);

        return mapToResponse(user);
    }

    private ProfileResponse mapToResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
            LawyerProfile lp = user.getLawyerProfile();
            response.setSpecialization(lp.getSpecialization());
            response.setLocation(lp.getLocation());
            response.setVerified(lp.isVerified());
            response.setLicenseNumber(lp.getLicenseNumber());
        }

        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            NgoProfile np = user.getNgoProfile();
            response.setSpecialization(np.getSpecialization());
            response.setLocation(np.getLocation());
            response.setVerified(np.isVerified());
            response.setNgoName(np.getNgoName());
            response.setRegistrationNumber(np.getRegistrationNumber());
        }

        return response;
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}