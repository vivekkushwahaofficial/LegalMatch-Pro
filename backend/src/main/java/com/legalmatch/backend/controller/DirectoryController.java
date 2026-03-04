package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.LawyerDirectoryResponse;
import com.legalmatch.backend.dto.NgoDirectoryResponse;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService directoryService;

    @GetMapping("/lawyers")
    public List<LawyerDirectoryResponse> getLawyers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Page<LawyerProfile> lawyers = directoryService.getLawyers(page, size);

        return lawyers.getContent()
                .stream()
                .map(this::mapLawyer)
                .toList();
    }

    @GetMapping("/ngos")
    public List<NgoDirectoryResponse> getNgos(
            @RequestParam(required = false) String location
    ) {

        List<NgoProfile> ngos = directoryService.getNgos(location);

        return ngos.stream()
                .map(this::mapNgo)
                .toList();
    }

    private LawyerDirectoryResponse mapLawyer(LawyerProfile lawyer) {

        LawyerDirectoryResponse dto = new LawyerDirectoryResponse();

        dto.setSpecialization(lawyer.getSpecialization());
        dto.setLocation(lawyer.getLocation());
        dto.setVerified(lawyer.isVerified());

        return dto;
    }

    private NgoDirectoryResponse mapNgo(NgoProfile ngo) {

        NgoDirectoryResponse dto = new NgoDirectoryResponse();

        dto.setOrganizationName(ngo.getOrganizationName());
        dto.setLocation(ngo.getLocation());
        dto.setVerified(ngo.isVerified());

        return dto;
    }
}