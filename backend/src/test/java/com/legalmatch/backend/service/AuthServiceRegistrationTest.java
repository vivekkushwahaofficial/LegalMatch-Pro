package com.legalmatch.backend.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthServiceRegistrationTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private LawyerProfileRepository lawyerProfileRepository;
    @Mock
    private NgoProfileRepository ngoProfileRepository;
    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                lawyerProfileRepository,
                ngoProfileRepository,
                jwtService,
                new BCryptPasswordEncoder()
        );
    }

    @Test
    void register_rejectsAdminRoleFromPublicEndpoint() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test Admin");
        request.setEmail("admin@test.com");
        request.setPassword("password123");
        request.setRole("ADMIN");

        when(userRepository.existsByEmail("admin@test.com")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
}
