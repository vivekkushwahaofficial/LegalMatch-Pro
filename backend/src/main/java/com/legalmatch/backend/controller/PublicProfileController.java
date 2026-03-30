package com.legalmatch.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.service.ProfileService;

@RestController
@RequestMapping({"/api", ""})
public class PublicProfileController {

    private final ProfileService profileService;

    public PublicProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/lawyers/{id}")
    public ProfileResponse getLawyerProfileById(@PathVariable Long id) {
        return profileService.getLawyerProfileById(id);
    }

    @GetMapping("/ngos/{id}")
    public ProfileResponse getNgoProfileById(@PathVariable Long id) {
        return profileService.getNgoProfileById(id);
    }
}
