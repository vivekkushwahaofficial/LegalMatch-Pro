package com.legalmatch.backend.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
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
@RequestMapping({"/api/directory", "/directory"})
public class DirectoryController {

    private static final int MAX_FILTER_LENGTH = 80;
    private static final Pattern SAFE_FILTER_PATTERN = Pattern.compile("^[A-Za-z0-9 .,'&\\-/]+$");

    private final DirectoryService directoryService;

    public DirectoryController(DirectoryService directoryService) {
        this.directoryService = directoryService;
    }

    @GetMapping("/lawyers")
    public List<LawyerDirectoryResponse> getLawyers(
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        final String effectiveSpecialization = specialization != null ? specialization : expertise;
        final String normalizedSpecialization = sanitizeFilter(effectiveSpecialization, "specialization");
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

        return paginateAndSortLawyers(mergedList, page, size, sortBy, sortDir);
    }

    @GetMapping("/ngos")
    public List<NgoDirectoryResponse> getNgos(
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "ngoName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        final String normalizedExpertise = sanitizeFilter(expertise, "expertise");
        final String normalizedLocation = sanitizeFilter(location, "location");

        List<NgoDirectoryResponse> mergedList = new ArrayList<>();

        List<NgoProfile> profiles = directoryService.getNgos(normalizedLocation, verified);
        mergedList.addAll(profiles.stream()
                .filter(p -> p.getUser() != null)
                .filter(p -> normalizedExpertise == null
                || (p.getSpecialization() != null && p.getSpecialization().equalsIgnoreCase(normalizedExpertise)))
                .map(this::mapNgoProfile)
                .collect(Collectors.toList()));

        List<NgoDirectory> directoryNgos = directoryService.getAllDirectoryNgos();
        mergedList.addAll(directoryNgos.stream()
                .filter(n -> (normalizedExpertise == null || (n.getExpertise() != null && n.getExpertise().equalsIgnoreCase(normalizedExpertise)))
                && (normalizedLocation == null || n.getLocation().equalsIgnoreCase(normalizedLocation))
                && (verified == null || (n.getVerified() != null && n.getVerified().equals(verified))))
                .map(this::mapNgoDirectory)
                .collect(Collectors.toList()));

        return paginateAndSortNgos(mergedList, page, size, sortBy, sortDir);
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

    private List<LawyerDirectoryResponse> paginateAndSortLawyers(
            List<LawyerDirectoryResponse> input,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Comparator<LawyerDirectoryResponse> comparator = switch (safe(sortBy)) {
            case "specialization", "expertise" ->
                Comparator.comparing(v -> safe(v.getSpecialization()));
            case "location" ->
                Comparator.comparing(v -> safe(v.getLocation()));
            case "verified" ->
                Comparator.comparing(LawyerDirectoryResponse::isVerified);
            default ->
                Comparator.comparing(v -> safe(v.getName()));
        };

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        return paginate(input.stream().sorted(comparator).toList(), safePage, safeSize);
    }

    private List<NgoDirectoryResponse> paginateAndSortNgos(
            List<NgoDirectoryResponse> input,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Comparator<NgoDirectoryResponse> comparator = switch (safe(sortBy)) {
            case "location" ->
                Comparator.comparing(v -> safe(v.getLocation()));
            case "verified" ->
                Comparator.comparing(NgoDirectoryResponse::isVerified);
            default ->
                Comparator.comparing(v -> safe(v.getNgoName()));
        };

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        return paginate(input.stream().sorted(comparator).toList(), safePage, safeSize);
    }

    private <T> List<T> paginate(List<T> sortedList, int page, int size) {
        int fromIndex = page * size;
        if (fromIndex >= sortedList.size()) {
            return List.of();
        }

        int toIndex = Math.min(fromIndex + size, sortedList.size());
        return sortedList.subList(fromIndex, toIndex);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
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
