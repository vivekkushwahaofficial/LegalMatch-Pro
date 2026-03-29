package com.legalmatch.backend.config;

import java.security.Principal;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import com.legalmatch.backend.security.JwtService;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public JwtChannelInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();

        if (StompCommand.CONNECT.equals(command)) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Missing or invalid Authorization header for WebSocket CONNECT");
            }

            String token = authHeader.substring(7);
            if (!jwtService.isTokenValid(token)) {
                throw new RuntimeException("Invalid JWT token for WebSocket CONNECT");
            }

            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            Principal principal = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    List.of(() -> "ROLE_" + role)
            );

            accessor.setUser(principal);
        }

        if (StompCommand.SEND.equals(command) || StompCommand.SUBSCRIBE.equals(command)) {
            if (accessor.getUser() == null) {
                throw new RuntimeException("Unauthenticated WebSocket frame");
            }
        }

        return message;
    }
}
