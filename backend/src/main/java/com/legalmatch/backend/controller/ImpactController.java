package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.ImpactLog;
import com.legalmatch.backend.service.ImpactService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping("/stats")
    public List<ImpactLog> getImpactStats() {
        return impactService.getAllImpactLogs();
    }
}
