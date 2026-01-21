package com.fittrack.backend.workout.dto;

import java.util.List;

/**
 * Request payload for creating a workout session from the frontend.
 */
public class WorkoutSessionRequest {

    private Long userId;
    private String name;

    /**
     * Epoch milliseconds when workout started (from Date.now()).
     */
    private Long startTimeEpochMillis;

    /**
     * Epoch milliseconds at finish time.
     */
    private Long endTimeEpochMillis;

    private Long durationSeconds;

    private String notes;

    private List<WorkoutExerciseRequest> exercises;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getStartTimeEpochMillis() {
        return startTimeEpochMillis;
    }

    public void setStartTimeEpochMillis(Long startTimeEpochMillis) {
        this.startTimeEpochMillis = startTimeEpochMillis;
    }

    public Long getEndTimeEpochMillis() {
        return endTimeEpochMillis;
    }

    public void setEndTimeEpochMillis(Long endTimeEpochMillis) {
        this.endTimeEpochMillis = endTimeEpochMillis;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<WorkoutExerciseRequest> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExerciseRequest> exercises) {
        this.exercises = exercises;
    }
}

