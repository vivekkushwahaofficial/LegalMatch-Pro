package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final LawyerProfileRepository lawyerRepository;
    private final NgoProfileRepository ngoRepository;

    // Get lawyers with pagination
    public Page<LawyerProfile> getLawyers(int page, int size) {
        return lawyerRepository.findAll(PageRequest.of(page, size));
    }

    // Get NGOs with optional location filter
    public List<NgoProfile> getNgos(String location) {

        if (location != null) {
            return ngoRepository.findByLocationIgnoreCase(location);
        }

        return ngoRepository.findByVerifiedTrue();
    }
}