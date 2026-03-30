package com.legalmatch.backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.entity.Log;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;
import com.legalmatch.backend.repository.LogRepository;
import com.legalmatch.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final LogRepository logRepository;

    public AdminController(UserRepository userRepository, LogRepository logRepository) {
        this.userRepository = userRepository;
        this.logRepository = logRepository;
    }

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

    @GetMapping("/system/logs")
    public Map<String, List<Log>> getSystemLogs() {
        try {
            // Fetch grouped logs from DB using simple type filters.
            List<Log> errorLogs = logRepository.findByType("ERROR");
            List<Log> activityLogs = logRepository.findByType("ACTIVITY");

            return Map.of(
                    "errorLogs", errorLogs != null ? errorLogs : Collections.emptyList(),
                    "activityLogs", activityLogs != null ? activityLogs : Collections.emptyList()
            );
        } catch (Exception ex) {
            // Production-safe fallback: never fail this endpoint.
            return Map.of(
                    "errorLogs", Collections.emptyList(),
                    "activityLogs", Collections.emptyList()
            );
        }
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
