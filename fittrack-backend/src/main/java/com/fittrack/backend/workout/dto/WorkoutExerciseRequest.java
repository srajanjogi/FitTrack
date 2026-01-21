package com.fittrack.backend.workout.dto;

import java.util.List;

public class WorkoutExerciseRequest {

    /**
     * Name chosen in the UI (e.g. "Bench press (barbell)").
     * We will try to match this against ExerciseDefinition.name.
     */
    private String name;

    /**
     * Optional ID of an existing ExerciseDefinition. If provided, we use it directly.
     */
    private Long exerciseDefinitionId;

    private String note;

    private Integer orderIndex;

    private List<WorkoutSetRequest> sets;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getExerciseDefinitionId() {
        return exerciseDefinitionId;
    }

    public void setExerciseDefinitionId(Long exerciseDefinitionId) {
        this.exerciseDefinitionId = exerciseDefinitionId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<WorkoutSetRequest> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSetRequest> sets) {
        this.sets = sets;
    }
}

