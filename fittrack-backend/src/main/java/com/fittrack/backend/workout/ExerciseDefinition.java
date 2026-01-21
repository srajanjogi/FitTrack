package com.fittrack.backend.workout;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Master list of exercises that can be used in workout sessions.
 *
 * This table will back the exercise picker in the frontend so you can
 * reuse the same definitions across many workouts.
 */
@Entity
@Table(name = "exercise_definitions")
public class ExerciseDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Main muscle group, e.g. Chest, Back, Legs, Shoulders, Arms, Core, Full Body.
     */
    @Column(nullable = false)
    private String muscleGroup;

    /**
     * Optional description of required equipment, e.g. Barbell, Dumbbell, Machine, Bodyweight.
     */
    private String equipment;

    @Column(nullable = false)
    private boolean active = true;

    public ExerciseDefinition() {
    }

    public ExerciseDefinition(Long id, String name, String muscleGroup, String equipment, boolean active) {
        this.id = id;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
        this.active = active;
    }

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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

