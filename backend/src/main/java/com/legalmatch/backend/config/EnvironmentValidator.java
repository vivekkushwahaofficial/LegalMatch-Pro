package com.legalmatch.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class EnvironmentValidator {

    private static final Logger log = LoggerFactory.getLogger(EnvironmentValidator.class);

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @PostConstruct
    public void validate() {
        log.info("EnvironmentValidator: Checking active profile: {}", activeProfile);
        if ("prod".equalsIgnoreCase(activeProfile)) {
            log.info("EnvironmentValidator: Validating production configuration variables...");
            
            if (!StringUtils.hasText(dbPassword) || "changeme".equalsIgnoreCase(dbPassword)) {
                log.error("CRITICAL ERROR: spring.datasource.password is empty, or using default placeholder ('changeme') in production!");
                throw new IllegalStateException("CRITICAL STARTUP ERROR: Secure database password (SPRING_DATASOURCE_PASSWORD) must be configured in production profile!");
            }

            if (!StringUtils.hasText(jwtSecret) || jwtSecret.length() < 32 || jwtSecret.contains("dev-only-secret-key-must-be-32-chars-min!!") || jwtSecret.contains("change-this-to-a-long-random-string")) {
                log.error("CRITICAL ERROR: jwt.secret is empty, too short (< 32 chars), or using default fallback placeholders in production!");
                throw new IllegalStateException("CRITICAL STARTUP ERROR: Secure JWT secret key (JWT_SECRET, minimum 32 characters) must be configured in production profile!");
            }
            
            log.info("EnvironmentValidator: Production variables validated successfully.");
        }
    }
}
