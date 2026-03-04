package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.ProfileUpdateRequest;
import com.legalmatch.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

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