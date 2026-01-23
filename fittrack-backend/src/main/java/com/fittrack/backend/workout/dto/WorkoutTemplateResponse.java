package com.fittrack.backend.workout.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class WorkoutTemplateResponse {
    private Long id;
    private String name;
    private Instant endTime; // Last performed date
    private List<ExerciseTemplateInfo> exercises = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public List<ExerciseTemplateInfo> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseTemplateInfo> exercises) {
        this.exercises = exercises;
    }

    public static class ExerciseTemplateInfo {
        private String name;
        private Integer setCount;
        private String muscleGroup;
        private String equipment;
        private List<PreviousSetInfo> previousSets = new ArrayList<>();

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getSetCount() {
            return setCount;
        }

        public void setSetCount(Integer setCount) {
            this.setCount = setCount;
        }

        public String getMuscleGroup() {
            return muscleGroup;
        }

        public void setMuscleGroup(String muscleGroup) {
            this.muscleGroup = muscleGroup;
        }

        public String getEquipment() {
            return equipment;
        }

        public void setEquipment(String equipment) {
            this.equipment = equipment;
        }

        public List<PreviousSetInfo> getPreviousSets() {
            return previousSets;
        }

        public void setPreviousSets(List<PreviousSetInfo> previousSets) {
            this.previousSets = previousSets;
        }
    }

    public static class PreviousSetInfo {
        private Double weightKg;
        private Integer reps;

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
    }
}
