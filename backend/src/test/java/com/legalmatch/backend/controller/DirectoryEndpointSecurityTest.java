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
    void publicDirectoryEndpoint_allowsRequestWithoutAuthHeader() throws Exception {
        when(directoryService.searchLawyers(null, null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryLawyers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/lawyers"))
                .andExpect(status().isOk());
    }

    @Test
    void publicDirectoryEndpoint_allowsRequestWithMalformedBearerHeader() throws Exception {
        when(directoryService.searchLawyers(null, null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryLawyers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/lawyers")
                .header("Authorization", "Bearer malformed.token.value"))
                .andExpect(status().isOk());
    }

    @Test
    void publicNgoDirectoryEndpoint_allowsRequestWithoutAuthHeader() throws Exception {
        when(directoryService.getNgos(null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryNgos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/ngos"))
                .andExpect(status().isOk());
    }

    @Test
    void publicNgoDirectoryEndpoint_allowsRequestWithMalformedBearerHeader() throws Exception {
        when(directoryService.getNgos(null)).thenReturn(Collections.emptyList());
        when(directoryService.getAllDirectoryNgos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/directory/ngos")
                .header("Authorization", "Bearer malformed.token.value"))
                .andExpect(status().isOk());
    }
}
