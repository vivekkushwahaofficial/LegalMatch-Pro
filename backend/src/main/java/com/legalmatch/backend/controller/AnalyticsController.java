package com.legalmatch.backend.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.service.AnalyticsService;

@RestController
@RequestMapping({"/api/analytics", "/analytics"})
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        return analyticsService.getOverview();
    }

    @GetMapping("/users")
    public Map<String, Object> users() {
        return analyticsService.getUserMetrics();
    }

    @GetMapping("/cases")
    public Map<String, Object> cases() {
        return analyticsService.getCaseMetrics();
    }

    @GetMapping("/matches")
    public Map<String, Object> matches() {
        return analyticsService.getMatchMetrics();
    }

    @GetMapping("/kpis")
    public Object kpis() {
        return analyticsService.getKpiCards();
    }
}
