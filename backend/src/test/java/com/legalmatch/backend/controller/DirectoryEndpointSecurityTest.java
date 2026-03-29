package com.legalmatch.backend.controller;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.legalmatch.backend.service.DirectoryService;

@SpringBootTest
@AutoConfigureMockMvc
class DirectoryEndpointSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DirectoryService directoryService;

    @Test
    void directoryEndpoint_rejectsRequestWithoutAuthHeader() throws Exception {
        when(directoryService.searchLawyers(null, null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryLawyers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/lawyers"))
                .andExpect(status().isForbidden());
    }

    @Test
    void directoryEndpoint_rejectsRequestWithMalformedBearerHeader() throws Exception {
        when(directoryService.searchLawyers(null, null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryLawyers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/lawyers")
                .header("Authorization", "Bearer malformed.token.value"))
                .andExpect(status().isForbidden());
    }

    @Test
    void ngoDirectoryEndpoint_rejectsRequestWithoutAuthHeader() throws Exception {
        when(directoryService.getNgos(null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryNgos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/ngos"))
                .andExpect(status().isForbidden());
    }

    @Test
    void ngoDirectoryEndpoint_rejectsRequestWithMalformedBearerHeader() throws Exception {
        when(directoryService.getNgos(null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryNgos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/ngos")
                .header("Authorization", "Bearer malformed.token.value"))
                .andExpect(status().isForbidden());
    }
}
