package com.fittrack.backend.workout.dto;

import java.time.Instant;

/**
 * DTO representing a single attendance entry (visit) for the frontend.
 */
public class AttendanceVisitResponse {

    private Long id;
    private Instant startTime;
    private Instant endTime;
    private Long durationSeconds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
}

