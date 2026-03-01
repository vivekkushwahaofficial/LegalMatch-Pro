package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.Lawyer;
import com.legalmatch.backend.entity.Ngo;
import com.legalmatch.backend.repository.LawyerRepository;
import com.legalmatch.backend.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final LawyerRepository lawyerRepository;
    private final NgoRepository ngoRepository;

    @GetMapping("/lawyers")
    public Page<Lawyer> getLawyers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
            return
    lawyerRepository.findAll(PageRequest.of(page,size));
        }

    @GetMapping("/ngos")
    public List<Ngo> getNgos(
            @RequestParam(required = false) String location
    ) {
        if (location != null) {
            return
    ngoRepository.findByLocationIgnoreCase(location);
        }
        return ngoRepository.findByVerifiedTrue();
    }
}