package com.fittrack.backend.workout;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * A single set performed as part of a workout exercise.
 */
@Entity
@Table(name = "workout_sets")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    @JsonIgnore
    private WorkoutExercise exercise;

    @Column(nullable = false)
    private Integer setNumber;

    @Column(nullable = false)
    private Double weightKg;

    @Column(nullable = false)
    private Integer reps;

    @Column(nullable = false)
    private boolean completed = true;

    private Double previousWeightKg;

    private Integer previousReps;

    public WorkoutSet() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WorkoutSet setExercise(WorkoutExercise exercise) {
        this.exercise = exercise;
        return this;
    }

    public WorkoutExercise getExercise() {
        return exercise;
    }

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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
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

