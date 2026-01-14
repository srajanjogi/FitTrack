package com.fittrack.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Basic Spring Security configuration.
 *
 * For now, we:
 * - allow unauthenticated access to /api/health so it can be tested easily
 * - keep default security for all other endpoints (will be customized later)
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // For now, we don't need CSRF protection because our API will be used by a separate frontend.
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/members/**").permitAll() // temporarily open for development
                        .anyRequest().authenticated())
                // Keep default login form for now for any protected endpoints.
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}

