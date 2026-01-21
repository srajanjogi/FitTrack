package com.fittrack.backend.workout;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Seed a basic list of common exercises into the exercise_definitions table
 * the first time the application starts.
 */
@Component
public class ExerciseDataInitializer implements CommandLineRunner {

    private final ExerciseDefinitionRepository repository;

    public ExerciseDataInitializer(ExerciseDefinitionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        List<ExerciseDefinition> seedExercises = Arrays.asList(
                create("Barbell Bench Press", "Chest", "Barbell"),
                create("Incline Dumbbell Press", "Chest", "Dumbbell"),
                create("Push-Up", "Chest", "Bodyweight"),
                create("Lat Pulldown", "Back", "Machine"),
                create("Barbell Row", "Back", "Barbell"),
                create("Seated Cable Row", "Back", "Machine"),
                create("Back Squat", "Legs", "Barbell"),
                create("Leg Press", "Legs", "Machine"),
                create("Walking Lunge", "Legs", "Dumbbell"),
                create("Romanian Deadlift", "Hamstrings", "Barbell"),
                create("Deadlift", "Back", "Barbell"),
                create("Overhead Press", "Shoulders", "Barbell"),
                create("Lateral Raise", "Shoulders", "Dumbbell"),
                create("Biceps Curl", "Arms", "Dumbbell"),
                create("Triceps Rope Pushdown", "Arms", "Cable"),
                create("Plank", "Core", "Bodyweight"),
                create("Hanging Leg Raise", "Core", "Bodyweight"),
                create("Treadmill Run", "Cardio", "Machine")
        );

        repository.saveAll(seedExercises);
    }

    private ExerciseDefinition create(String name, String muscleGroup, String equipment) {
        ExerciseDefinition def = new ExerciseDefinition();
        def.setName(name);
        def.setMuscleGroup(muscleGroup);
        def.setEquipment(equipment);
        def.setActive(true);
        return def;
    }
}

