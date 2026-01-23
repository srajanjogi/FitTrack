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
        // Seed initial exercises if table is empty
        if (repository.count() == 0) {
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

        // Update existing exercises that have null or empty muscle groups
        updateExistingExercises();
    }

    private void updateExistingExercises() {
        // Common exercise mappings
        java.util.Map<String, String> exerciseMappings = new java.util.HashMap<>();
        exerciseMappings.put("Ab wheel rollout", "Core");
        exerciseMappings.put("Back extension", "Back");
        exerciseMappings.put("Lat Pulldown", "Back");
        exerciseMappings.put("Lat Pulldown - Wide Grip", "Back");
        exerciseMappings.put("Bent Over One Arm Row", "Back");
        exerciseMappings.put("Bench Press", "Chest");
        exerciseMappings.put("Incline Bench Press", "Chest");
        exerciseMappings.put("Decline Bench Press", "Chest");
        exerciseMappings.put("Push Up", "Chest");
        exerciseMappings.put("Squat", "Legs");
        exerciseMappings.put("Leg Press", "Legs");
        exerciseMappings.put("Leg Extension", "Legs");
        exerciseMappings.put("Deadlift", "Back");
        exerciseMappings.put("Overhead Press", "Shoulders");
        exerciseMappings.put("Lateral Raise", "Shoulders");
        exerciseMappings.put("Bicep Curl", "Arms");
        exerciseMappings.put("Tricep Extension", "Arms");
        exerciseMappings.put("Plank", "Core");
        exerciseMappings.put("Crunch", "Core");
        exerciseMappings.put("Sit-up", "Core");
        exerciseMappings.put("Treadmill", "Cardio");
        exerciseMappings.put("Running", "Cardio");
        exerciseMappings.put("Exercise Bike", "Cardio");
        exerciseMappings.put("Elliptical", "Cardio");

        // Find all exercises and update those with missing muscle groups
        List<ExerciseDefinition> allExercises = repository.findAll();
        boolean updated = false;
        for (ExerciseDefinition exercise : allExercises) {
            if (exercise.getMuscleGroup() == null || 
                exercise.getMuscleGroup().trim().isEmpty() || 
                exercise.getMuscleGroup().equalsIgnoreCase("Unknown")) {
                
                String muscleGroup = exerciseMappings.get(exercise.getName());
                if (muscleGroup == null) {
                    // Try case-insensitive match
                    muscleGroup = exerciseMappings.entrySet().stream()
                            .filter(e -> e.getKey().equalsIgnoreCase(exercise.getName()))
                            .map(java.util.Map.Entry::getValue)
                            .findFirst()
                            .orElse(null);
                }
                
                if (muscleGroup != null) {
                    exercise.setMuscleGroup(muscleGroup);
                    repository.save(exercise);
                    updated = true;
                }
            }
        }
        
        if (updated) {
            System.out.println("Updated muscle groups for existing exercises");
        }
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

