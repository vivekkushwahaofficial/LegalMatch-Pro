package com.legalmatch.backend.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.repository.LawyerDirectoryRepository;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoDirectoryRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;

@ExtendWith(MockitoExtension.class)
class DirectoryServiceFilterTest {

    @Mock
    private LawyerDirectoryRepository lawyerDirectoryRepository;
    @Mock
    private NgoDirectoryRepository ngoDirectoryRepository;
    @Mock
    private LawyerProfileRepository lawyerProfileRepository;
    @Mock
    private NgoProfileRepository ngoProfileRepository;
    @Mock
    private RestTemplate restTemplate;

    private DirectoryService directoryService;

    @BeforeEach
    void setUp() {
        directoryService = new DirectoryService(
                lawyerDirectoryRepository,
                ngoDirectoryRepository,
                lawyerProfileRepository,
                ngoProfileRepository,
                restTemplate
        );
    }

    @Test
    void searchLawyers_filtersByVerifiedWhenProvided() {
        LawyerProfile verified = new LawyerProfile();
        verified.setVerified(true);

        LawyerProfile unverified = new LawyerProfile();
        unverified.setVerified(false);

        when(lawyerProfileRepository.findAll()).thenReturn(List.of(verified, unverified));

        List<LawyerProfile> result = directoryService.searchLawyers(null, null, true);
        assertEquals(1, result.size());
        assertEquals(true, result.get(0).isVerified());
    }

    @Test
    void getNgos_filtersByVerifiedWhenProvided() {
        NgoProfile verified = new NgoProfile();
        verified.setVerified(true);

        NgoProfile unverified = new NgoProfile();
        unverified.setVerified(false);

        when(ngoProfileRepository.findAll()).thenReturn(List.of(verified, unverified));

        List<NgoProfile> result = directoryService.getNgos(null, false);
        assertEquals(1, result.size());
        assertEquals(false, result.get(0).isVerified());
    }
}
