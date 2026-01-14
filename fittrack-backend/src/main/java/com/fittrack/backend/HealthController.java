package com.fittrack.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple controller to verify that the FitTrack backend is running.
 * Once the app starts, you can call GET /api/health to test it.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String health() {
        return "FitTrack backend is running";
    }
}

