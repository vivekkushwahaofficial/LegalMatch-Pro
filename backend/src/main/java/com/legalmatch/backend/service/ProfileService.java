package com.legalmatch.backend.service;

import java.util.Objects;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.ProfileUpdateRequest;
import com.legalmatch.backend.entity.LawyerDirectory;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoDirectory;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.LawyerDirectoryRepository;
import com.legalmatch.backend.repository.NgoDirectoryRepository;
import com.legalmatch.backend.repository.UserRepository;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final LawyerDirectoryRepository lawyerDirectoryRepository;
    private final NgoDirectoryRepository ngoDirectoryRepository;

    public ProfileService(
            UserRepository userRepository,
            LawyerDirectoryRepository lawyerDirectoryRepository,
            NgoDirectoryRepository ngoDirectoryRepository
    ) {
        this.userRepository = userRepository;
        this.lawyerDirectoryRepository = lawyerDirectoryRepository;
        this.ngoDirectoryRepository = ngoDirectoryRepository;
    }

    public ProfileResponse getMyProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToResponse(user);
    }

    public ProfileResponse getLawyerProfileById(Long id) {
        Long safeId = Objects.requireNonNull(id, "id is required");
        User user = userRepository.findById(safeId).orElse(null);
        if (user != null && user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
            return mapToResponse(user);
        }

        LawyerDirectory directoryLawyer = lawyerDirectoryRepository.findById(safeId)
                .orElseThrow(() -> new RuntimeException("Lawyer profile not found"));

        return mapDirectoryLawyerToResponse(directoryLawyer);
    }

    public ProfileResponse getNgoProfileById(Long id) {
        Long safeId = Objects.requireNonNull(id, "id is required");
        User user = userRepository.findById(safeId).orElse(null);
        if (user != null && user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            return mapToResponse(user);
        }

        NgoDirectory directoryNgo = ngoDirectoryRepository.findById(safeId)
                .orElseThrow(() -> new RuntimeException("NGO profile not found"));

        return mapDirectoryNgoToResponse(directoryNgo);
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
            if (request.getSpecialization() != null) {
                lp.setSpecialization(request.getSpecialization());
            }
            if (request.getLicenseNumber() != null) {
                lp.setLicenseNumber(request.getLicenseNumber());
            }
            if (request.getLocation() != null) {
                lp.setLocation(request.getLocation());
            }
        }

        // NGO updates
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            NgoProfile np = user.getNgoProfile();
            if (request.getNgoName() != null) {
                np.setNgoName(request.getNgoName());
            }
            if (request.getRegistrationNumber() != null) {
                np.setRegistrationNumber(request.getRegistrationNumber());
            }
            if (request.getLocation() != null) {
                np.setLocation(request.getLocation());
            }
            if (request.getSpecialization() != null) {
                np.setSpecialization(request.getSpecialization());
            }
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

    private ProfileResponse mapDirectoryNgoToResponse(NgoDirectory directoryNgo) {
        ProfileResponse response = new ProfileResponse();
        response.setId(directoryNgo.getId());
        response.setName(directoryNgo.getName());
        response.setEmail("");
        response.setRole(Role.NGO.name());
        response.setSpecialization(directoryNgo.getExpertise());
        response.setLocation(directoryNgo.getLocation());
        response.setVerified(Boolean.TRUE.equals(directoryNgo.getVerified()));
        response.setNgoName(directoryNgo.getName());
        response.setRegistrationNumber("");
        return response;
    }

    private ProfileResponse mapDirectoryLawyerToResponse(LawyerDirectory directoryLawyer) {
        ProfileResponse response = new ProfileResponse();
        response.setId(directoryLawyer.getId());
        response.setName(directoryLawyer.getName());
        response.setEmail("");
        response.setRole(Role.LAWYER.name());
        response.setSpecialization(directoryLawyer.getExpertise());
        response.setLocation(directoryLawyer.getLocation());
        response.setVerified(Boolean.TRUE.equals(directoryLawyer.getVerified()));
        response.setLicenseNumber("");
        return response;
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
