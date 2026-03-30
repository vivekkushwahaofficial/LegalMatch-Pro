package com.legalmatch.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.ProfileUpdateRequest;
import com.legalmatch.backend.service.ProfileService;

@RestController
@RequestMapping({"/api/profile", "/profile"})
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse getMyProfile(Authentication authentication) {

        return profileService.getMyProfile(authentication.getName());
    }

    @PutMapping("/update")
    public ProfileResponse updateMyProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {

        return profileService.updateMyProfile(authentication.getName(), request);
    }
}
