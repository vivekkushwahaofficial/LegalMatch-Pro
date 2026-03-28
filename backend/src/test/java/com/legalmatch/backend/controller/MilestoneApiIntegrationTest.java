package com.legalmatch.backend.controller;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.legalmatch.backend.security.JwtService;
import com.legalmatch.backend.service.CaseService;
import com.legalmatch.backend.service.DirectoryService;

@SpringBootTest
@AutoConfigureMockMvc
class MilestoneApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockBean
    private DirectoryService directoryService;

    @MockBean
    private CaseService caseService;

    @Test
    void getLawyers_verifiedTrue_passesFiltersToService() throws Exception {
        when(directoryService.searchLawyers("Family", "Mumbai", true)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryLawyers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/lawyers")
                .param("specialization", "Family")
                .param("location", "Mumbai")
                .param("verified", "true"))
                .andExpect(status().isOk());

        verify(directoryService).searchLawyers("Family", "Mumbai", true);
    }

    @Test
    void getNgos_verifiedFalse_passesFiltersToService() throws Exception {
        when(directoryService.getNgos("Delhi", false)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryNgos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/ngos")
                .param("location", "Delhi")
                .param("verified", "false"))
                .andExpect(status().isOk());

        verify(directoryService).getNgos("Delhi", false);
    }

    @Test
    void updateCaseStatus_invalidStatus_returnsBadRequest() throws Exception {
        String token = jwtService.generateAccessToken("admin@test.com", "ADMIN");

        when(caseService.updateCaseStatus(1L, "CLOSED"))
                .thenThrow(new RuntimeException("Invalid case status: CLOSED"));

        mockMvc.perform(put("/api/cases/1/status")
                .param("status", "CLOSED")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }
}
