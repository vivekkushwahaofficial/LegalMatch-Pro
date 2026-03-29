package com.legalmatch.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.client.RestTemplate;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final DirectoryRateLimitInterceptor directoryRateLimitInterceptor;

    public WebConfig(DirectoryRateLimitInterceptor directoryRateLimitInterceptor) {
        this.directoryRateLimitInterceptor = directoryRateLimitInterceptor;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(directoryRateLimitInterceptor)
                .addPathPatterns("/api/directory/**");
    }
}
