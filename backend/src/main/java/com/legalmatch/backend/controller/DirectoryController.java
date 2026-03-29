package com.legalmatch.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.dto.LawyerDirectoryResponse;
import com.legalmatch.backend.dto.NgoDirectoryResponse;
import com.legalmatch.backend.entity.LawyerDirectory;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoDirectory;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.service.DirectoryService;

@RestController
@RequestMapping("/api/directory")
public class DirectoryController {

    private static final int MAX_FILTER_LENGTH = 80;
    private static final Pattern SAFE_FILTER_PATTERN = Pattern.compile("^[A-Za-z0-9 .,'&\\-/]+$");

    private final DirectoryService directoryService;

    public DirectoryController(DirectoryService directoryService) {
        this.directoryService = directoryService;
    }

    @GetMapping("/lawyers")
    public List<LawyerDirectoryResponse> getLawyers(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified
    ) {
        final String normalizedSpecialization = sanitizeFilter(specialization, "specialization");
        final String normalizedLocation = sanitizeFilter(location, "location");

        List<LawyerDirectoryResponse> mergedList = new ArrayList<>();

        List<LawyerProfile> profiles = directoryService.searchLawyers(normalizedSpecialization, normalizedLocation, verified);
        mergedList.addAll(profiles.stream()
                .filter(p -> p.getUser() != null)
                .map(this::mapLawyerProfile)
                .collect(Collectors.toList()));

        List<LawyerDirectory> directoryLawyers = directoryService.getAllDirectoryLawyers();
        mergedList.addAll(directoryLawyers.stream()
                .filter(l -> (normalizedSpecialization == null || l.getExpertise().equalsIgnoreCase(normalizedSpecialization))
                && (normalizedLocation == null || l.getLocation().equalsIgnoreCase(normalizedLocation))
                && (verified == null || (l.getVerified() != null && l.getVerified().equals(verified))))
                .map(this::mapLawyerDirectory)
                .collect(Collectors.toList()));

        return mergedList;
    }

    @GetMapping("/ngos")
    public List<NgoDirectoryResponse> getNgos(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified
    ) {
        final String normalizedLocation = sanitizeFilter(location, "location");

        List<NgoDirectoryResponse> mergedList = new ArrayList<>();

        List<NgoProfile> profiles = directoryService.getNgos(normalizedLocation, verified);
        mergedList.addAll(profiles.stream()
                .filter(p -> p.getUser() != null)
                .map(this::mapNgoProfile)
                .collect(Collectors.toList()));

        List<NgoDirectory> directoryNgos = directoryService.getAllDirectoryNgos();
        mergedList.addAll(directoryNgos.stream()
                .filter(n -> (normalizedLocation == null || n.getLocation().equalsIgnoreCase(normalizedLocation))
                && (verified == null || (n.getVerified() != null && n.getVerified().equals(verified))))
                .map(this::mapNgoDirectory)
                .collect(Collectors.toList()));

        return mergedList;
    }

    private LawyerDirectoryResponse mapLawyerProfile(LawyerProfile profile) {
        LawyerDirectoryResponse dto = new LawyerDirectoryResponse();
        dto.setName(profile.getUser().getName());
        dto.setSpecialization(profile.getSpecialization());
        dto.setLocation(profile.getLocation());
        dto.setVerified(profile.isVerified());
        dto.setOrganizationDetails("Registered Member");
        return dto;
    }

    private LawyerDirectoryResponse mapLawyerDirectory(LawyerDirectory dir) {
        LawyerDirectoryResponse dto = new LawyerDirectoryResponse();
        dto.setName(dir.getName());
        dto.setSpecialization(dir.getExpertise());
        dto.setLocation(dir.getLocation());
        dto.setVerified(dir.getVerified() != null && dir.getVerified());
        dto.setOrganizationDetails(dir.getOrganizationDetails());
        return dto;
    }

    private NgoDirectoryResponse mapNgoProfile(NgoProfile profile) {
        NgoDirectoryResponse dto = new NgoDirectoryResponse();
        dto.setNgoName(profile.getNgoName());
        dto.setLocation(profile.getLocation());
        dto.setVerified(profile.isVerified());
        dto.setOrganizationDetails("Registered Member");
        return dto;
    }

    private NgoDirectoryResponse mapNgoDirectory(NgoDirectory dir) {
        NgoDirectoryResponse dto = new NgoDirectoryResponse();
        dto.setNgoName(dir.getName());
        dto.setLocation(dir.getLocation());
        dto.setVerified(dir.getVerified() != null && dir.getVerified());
        dto.setOrganizationDetails(dir.getOrganizationDetails());
        return dto;
    }

    private String sanitizeFilter(String input, String fieldName) {
        if (input == null) {
            return null;
        }

        String normalized = input.trim();
        if (normalized.isEmpty()) {
            return null;
        }

        if (normalized.length() > MAX_FILTER_LENGTH) {
            throw new RuntimeException(fieldName + " is too long");
        }

        if (!SAFE_FILTER_PATTERN.matcher(normalized).matches()) {
            throw new RuntimeException("Invalid characters in " + fieldName);
        }

        return normalized;
    }
}
