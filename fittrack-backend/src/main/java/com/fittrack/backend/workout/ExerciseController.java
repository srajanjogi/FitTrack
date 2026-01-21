package com.fittrack.backend.workout;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Simple read-only API for listing available exercises.
 *
 * This will be used by the frontend exercise picker so that exercises
 * come from the database instead of a hardcoded list.
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseDefinitionRepository exerciseDefinitionRepository;

    public ExerciseController(ExerciseDefinitionRepository exerciseDefinitionRepository) {
        this.exerciseDefinitionRepository = exerciseDefinitionRepository;
    }

    @GetMapping
    public List<ExerciseDefinition> listActiveExercises() {
        return exerciseDefinitionRepository.findAllByActiveTrueOrderByNameAsc();
    }
}

