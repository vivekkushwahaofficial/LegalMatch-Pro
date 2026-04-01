package com.legalmatch.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.legalmatch.backend.security.JwtAuthenticationFilter;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for REST API
                .csrf(AbstractHttpConfigurer::disable)
                // JWT is stateless
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // API Authorization rules
                .authorizeHttpRequests(auth -> auth
                // Allow browser preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public auth and health APIs
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                // WebSocket/SockJS handshake must be open; STOMP CONNECT is validated by JwtChannelInterceptor.
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/directory/**").authenticated()
                // Admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Authenticated users
                .requestMatchers(HttpMethod.POST, "/api/cases", "/cases").hasRole("CITIZEN")
                .requestMatchers(HttpMethod.GET, "/api/cases/my", "/cases/my").hasRole("CITIZEN")
                .requestMatchers("/api/cases/**").authenticated()
                .requestMatchers("/cases/**").authenticated()
                .requestMatchers("/api/profile/**").authenticated()
                .requestMatchers("/profile/**").authenticated()
                .requestMatchers("/api/matches/**").authenticated()
                .requestMatchers("/matches/**").authenticated()
                .requestMatchers("/api/matching/**").authenticated()
                .requestMatchers("/api/directory/**").authenticated()
                .requestMatchers("/directory/**").authenticated()
                .requestMatchers("/api/chats/**").authenticated()
                .requestMatchers("/chats/**").authenticated()
                .requestMatchers("/api/chat/**").authenticated()
                .requestMatchers("/api/appointments/**").authenticated()
                .requestMatchers("/appointments/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/notifications/**").authenticated()
                // Everything else requires login
                .anyRequest().authenticated()
                )
                // Add JWT filter
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
