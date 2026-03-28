package com.legalmatch.backend.config;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class DirectoryRateLimitInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, RateWindow> clientWindows = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientKey = resolveClientIp(request);
        long now = Instant.now().toEpochMilli();

        RateWindow currentWindow = clientWindows.compute(clientKey, (key, existing) -> {
            if (existing == null || now - existing.windowStartMs >= WINDOW_MS) {
                return new RateWindow(now, 1);
            }
            existing.requestCount++;
            return existing;
        });

        if (currentWindow.requestCount > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Too many directory requests. Please try again later.\"}");
            return false;
        }

        return true;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class RateWindow {

        private final long windowStartMs;
        private int requestCount;

        private RateWindow(long windowStartMs, int requestCount) {
            this.windowStartMs = windowStartMs;
            this.requestCount = requestCount;
        }
    }
}
