package com.fittrack.backend.workout;

import com.fittrack.backend.auth.User;
import com.fittrack.backend.auth.UserRepository;
import com.fittrack.backend.workout.dto.WorkoutExerciseRequest;
import com.fittrack.backend.workout.dto.WorkoutSessionRequest;
import com.fittrack.backend.workout.dto.WorkoutSetRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

/**
 * API for saving workout sessions with exercises and sets.
 */
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutSessionRepository sessionRepository;
    private final ExerciseDefinitionRepository exerciseDefinitionRepository;
    private final UserRepository userRepository;

    public WorkoutController(
            WorkoutSessionRepository sessionRepository,
            ExerciseDefinitionRepository exerciseDefinitionRepository,
            UserRepository userRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.exerciseDefinitionRepository = exerciseDefinitionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> saveWorkout(@RequestBody WorkoutSessionRequest request) {
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }

        WorkoutSession session = new WorkoutSession();
        session.setUser(user);
        session.setName(request.getName());
        if (request.getStartTimeEpochMillis() != null) {
            session.setStartTime(Instant.ofEpochMilli(request.getStartTimeEpochMillis()));
        } else {
            session.setStartTime(Instant.now());
        }
        if (request.getEndTimeEpochMillis() != null) {
            session.setEndTime(Instant.ofEpochMilli(request.getEndTimeEpochMillis()));
        }
        session.setDurationSeconds(request.getDurationSeconds());
        session.setNotes(request.getNotes());

        long totalVolume = 0L;

        if (request.getExercises() != null) {
            int index = 0;
            for (WorkoutExerciseRequest exReq : request.getExercises()) {
                if (exReq.getSets() == null || exReq.getSets().isEmpty()) {
                    continue;
                }

                WorkoutExercise exercise = new WorkoutExercise();
                exercise.setSession(session);
                exercise.setDisplayName(exReq.getName());
                exercise.setOrderIndex(exReq.getOrderIndex() != null ? exReq.getOrderIndex() : index++);
                exercise.setNote(exReq.getNote());

                ExerciseDefinition definition = null;
                if (exReq.getExerciseDefinitionId() != null) {
                    definition = exerciseDefinitionRepository
                            .findById(exReq.getExerciseDefinitionId())
                            .orElse(null);
                }
                if (definition == null && exReq.getName() != null) {
                    definition = exerciseDefinitionRepository
                            .findByNameIgnoreCase(exReq.getName())
                            .orElse(null);
                }
                if (definition == null && exReq.getName() != null) {
                    // If not found, create a simple definition on the fly.
                    ExerciseDefinition created = new ExerciseDefinition();
                    created.setName(exReq.getName());
                    created.setMuscleGroup("Unknown");
                    created.setEquipment(null);
                    created.setActive(true);
                    definition = exerciseDefinitionRepository.save(created);
                }
                exercise.setExerciseDefinition(definition);

                if (exReq.getSets() != null) {
                    for (WorkoutSetRequest setReq : exReq.getSets()) {
                        if (setReq.getWeightKg() == null || setReq.getReps() == null) {
                            continue;
                        }
                        WorkoutSet set = new WorkoutSet();
                        set.setExercise(exercise);
                        set.setSetNumber(setReq.getSetNumber());
                        set.setWeightKg(setReq.getWeightKg());
                        set.setReps(setReq.getReps());
                        set.setCompleted(setReq.getCompleted() != null ? setReq.getCompleted() : true);
                        set.setPreviousWeightKg(setReq.getPreviousWeightKg());
                        set.setPreviousReps(setReq.getPreviousReps());

                        exercise.getSets().add(set);

                        if (set.isCompleted()) {
                            totalVolume += Math.round(set.getWeightKg() * set.getReps());
                        }
                    }
                }

                session.getExercises().add(exercise);
            }
        }

        session.setTotalVolume(totalVolume);

        WorkoutSession saved = sessionRepository.save(session);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId());
    }
}

