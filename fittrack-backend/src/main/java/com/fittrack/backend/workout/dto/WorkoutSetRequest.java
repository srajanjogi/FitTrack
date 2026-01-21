package com.fittrack.backend.workout.dto;

public class WorkoutSetRequest {

    private Integer setNumber;
    private Double weightKg;
    private Integer reps;
    private Boolean completed;
    private Double previousWeightKg;
    private Integer previousReps;

    public Integer getSetNumber() {
        return setNumber;
    }

    public void setSetNumber(Integer setNumber) {
        this.setNumber = setNumber;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Double getPreviousWeightKg() {
        return previousWeightKg;
    }

    public void setPreviousWeightKg(Double previousWeightKg) {
        this.previousWeightKg = previousWeightKg;
    }

    public Integer getPreviousReps() {
        return previousReps;
    }

    public void setPreviousReps(Integer previousReps) {
        this.previousReps = previousReps;
    }
}

