package com.legalmatch.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    // Test API
    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Welcome Admin! You are authorized.";
    }

    // ✅ This API is required for your React AdminDashboard
    @GetMapping("/users")
    public List<User> getPendingUsers() {
        return userRepository.findByStatus(VerificationStatus.PENDING);
    }

    @PutMapping("/approve/{id}")
    public String approveUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(VerificationStatus.APPROVED);
        userRepository.save(user);

        return "User approved";
    }

    @PutMapping("/reject/{id}")
    public String rejectUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(VerificationStatus.REJECTED);
        userRepository.save(user);

        return "User rejected";
    }

}
