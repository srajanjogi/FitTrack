package com.fittrack.backend.workout;

import com.fittrack.backend.auth.User;
import com.fittrack.backend.auth.UserRepository;
import com.fittrack.backend.workout.dto.WorkoutExerciseRequest;
import com.fittrack.backend.workout.dto.WorkoutSessionRequest;
import com.fittrack.backend.workout.dto.WorkoutSetRequest;
import com.fittrack.backend.workout.dto.WorkoutTemplateResponse;
import com.fittrack.backend.workout.dto.AttendanceStatsResponse;
import com.fittrack.backend.workout.dto.AttendanceVisitResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    /**
     * Get the 6 most recent workout sessions for a user as templates.
     */
    @GetMapping("/templates/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getRecentWorkoutTemplates(@PathVariable("userId") Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            List<WorkoutSession> sessions = sessionRepository.findRecentWorkoutsByUser(
                    user, PageRequest.of(0, 6));
            
        // Eagerly load exercises, sets, and exercise definitions to avoid lazy loading issues
        for (WorkoutSession session : sessions) {
            if (session.getExercises() != null) {
                session.getExercises().size(); // Trigger lazy loading
                for (WorkoutExercise exercise : session.getExercises()) {
                    if (exercise.getSets() != null) {
                        exercise.getSets().size(); // Trigger lazy loading
                    }
                    // Also trigger loading of exercise definition
                    if (exercise.getExerciseDefinition() != null) {
                        exercise.getExerciseDefinition().getName(); // Trigger lazy loading
                    }
                }
            }
        }
            
            // Convert all sessions to templates (even if they have no exercises yet)
            // The frontend will handle displaying them appropriately
            List<WorkoutTemplateResponse> templates = sessions.stream()
                    .map(this::convertToTemplate)
                    .filter(template -> template.getExercises() != null && !template.getExercises().isEmpty())
                    .limit(6)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching templates: " + e.getMessage());
		}
	}

	/**
	 * Get up to 6 favourite workout sessions for a user as templates.
	 */
	@GetMapping("/favorites/{userId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getFavoriteWorkoutTemplates(@PathVariable("userId") Long userId) {
		try {
			User user = userRepository.findById(userId)
					.orElse(null);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}

			List<WorkoutSession> sessions = sessionRepository.findFavoriteWorkoutsByUser(
					user, PageRequest.of(0, 6));

			// Eagerly load relationships similar to recent templates
			for (WorkoutSession session : sessions) {
				if (session.getExercises() != null) {
					session.getExercises().size();
					for (WorkoutExercise exercise : session.getExercises()) {
						if (exercise.getSets() != null) {
							exercise.getSets().size();
						}
						if (exercise.getExerciseDefinition() != null) {
							exercise.getExerciseDefinition().getName();
						}
					}
				}
			}

			List<WorkoutTemplateResponse> templates = sessions.stream()
					.map(this::convertToTemplate)
					.filter(template -> template.getExercises() != null && !template.getExercises().isEmpty())
					.limit(6)
					.collect(Collectors.toList());

			return ResponseEntity.ok(templates);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error fetching favourite templates: " + e.getMessage());
		}
	}

    /**
     * Debug endpoint to check workout sessions for a user.
     */
    @GetMapping("/debug/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> debugWorkouts(@PathVariable("userId") Long userId) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<WorkoutSession> sessions = sessionRepository.findRecentWorkoutsByUser(
                user, PageRequest.of(0, 10));
        
        // Return basic info about sessions
        List<java.util.Map<String, Object>> debugInfo = sessions.stream()
                .map(session -> {
                    java.util.Map<String, Object> info = new java.util.HashMap<>();
                    info.put("id", session.getId());
                    info.put("name", session.getName());
                    info.put("endTime", session.getEndTime());
                    info.put("exerciseCount", session.getExercises() != null ? session.getExercises().size() : 0);
                    if (session.getExercises() != null && !session.getExercises().isEmpty()) {
                        info.put("firstExercise", session.getExercises().get(0).getDisplayName());
                        info.put("firstExerciseSetCount", session.getExercises().get(0).getSets() != null ? 
                                session.getExercises().get(0).getSets().size() : 0);
                    }
                    return info;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(debugInfo);
    }

	/**
	 * Mark or unmark a workout session as favourite.
	 */
	@PostMapping("/{sessionId}/favorite")
	public ResponseEntity<?> setFavorite(
			@PathVariable("sessionId") Long sessionId,
			@RequestParam(name = "value", defaultValue = "true") boolean value
	) {
		WorkoutSession session = sessionRepository.findById(sessionId).orElse(null);
		if (session == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
		}

		session.setFavorite(value);
		sessionRepository.save(session);

		return ResponseEntity.ok().build();
	}

	/**
	 * Aggregate simple attendance statistics for a user based on workout sessions.
	 */
	@GetMapping("/attendance/stats/{userId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getAttendanceStats(@PathVariable("userId") Long userId) {
		User user = userRepository.findById(userId).orElse(null);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		List<WorkoutSession> sessions = sessionRepository.findByUserOrderByStartTimeAsc(user);
		if (sessions.isEmpty()) {
			AttendanceStatsResponse empty = new AttendanceStatsResponse();
			empty.setVisitsThisMonth(0);
			empty.setCurrentStreakDays(0);
			empty.setTotalVisits(0);
			empty.setAverageDurationSeconds(0);
			return ResponseEntity.ok(empty);
		}

		ZoneId zone = ZoneId.systemDefault();
		LocalDate now = LocalDate.now(zone);

		// Map sessions to their workout date (based on endTime if present, otherwise startTime)
		List<LocalDate> sessionDates = new ArrayList<>();
		long totalDurationSeconds = 0L;
		int sessionsWithDuration = 0;

		for (WorkoutSession s : sessions) {
			Instant endOrStart = s.getEndTime() != null ? s.getEndTime() : s.getStartTime();
			if (endOrStart != null) {
				sessionDates.add(endOrStart.atZone(zone).toLocalDate());
			}
			if (s.getDurationSeconds() != null) {
				totalDurationSeconds += s.getDurationSeconds();
				sessionsWithDuration++;
			}
		}

		// Total visits = total sessions
		long totalVisits = sessions.size();

		// Visits this month = distinct days in current month with at least one session
		Set<LocalDate> uniqueDaysThisMonth = new LinkedHashSet<>();
		for (LocalDate date : sessionDates) {
			if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth()) {
				uniqueDaysThisMonth.add(date);
			}
		}

		// Current streak: consecutive days ending at the most recent workout day
		// Use distinct sorted dates descending
		Set<LocalDate> uniqueAllDays = new LinkedHashSet<>(sessionDates);
		List<LocalDate> sortedDistinct = new ArrayList<>(uniqueAllDays);
		sortedDistinct.sort((a, b) -> b.compareTo(a)); // newest first

		int streak = 0;
		if (!sortedDistinct.isEmpty()) {
			streak = 1;
			LocalDate prev = sortedDistinct.get(0);
			for (int i = 1; i < sortedDistinct.size(); i++) {
				LocalDate current = sortedDistinct.get(i);
				if (prev.minusDays(1).equals(current)) {
					streak++;
					prev = current;
				} else {
					break;
				}
			}
		}

		long avgDurationSeconds = 0L;
		if (sessionsWithDuration > 0) {
			avgDurationSeconds = totalDurationSeconds / sessionsWithDuration;
		}

		AttendanceStatsResponse response = new AttendanceStatsResponse();
		response.setVisitsThisMonth(uniqueDaysThisMonth.size());
		response.setCurrentStreakDays(streak);
		response.setTotalVisits(totalVisits);
		response.setAverageDurationSeconds(avgDurationSeconds);

		return ResponseEntity.ok(response);
	}

	/**
	 * Latest attendance visits (workout sessions) for a user, max 50.
	 */
	@GetMapping("/attendance/visits/{userId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getAttendanceVisits(
			@PathVariable("userId") Long userId,
			@RequestParam(name = "limit", defaultValue = "50") int limit
	) {
		User user = userRepository.findById(userId).orElse(null);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		if (limit <= 0 || limit > 50) {
			limit = 50;
		}

		List<WorkoutSession> sessions = sessionRepository.findByUserOrderByStartTimeDesc(
				user, PageRequest.of(0, limit));

		List<AttendanceVisitResponse> visits = sessions.stream()
				.map(s -> {
					AttendanceVisitResponse v = new AttendanceVisitResponse();
					v.setId(s.getId());
					v.setStartTime(s.getStartTime());
					v.setEndTime(s.getEndTime());
					v.setDurationSeconds(s.getDurationSeconds());
					return v;
				})
				.toList();

		return ResponseEntity.ok(visits);
	}

    private WorkoutTemplateResponse convertToTemplate(WorkoutSession session) {
        WorkoutTemplateResponse template = new WorkoutTemplateResponse();
        template.setId(session.getId());
        template.setName(session.getName() != null ? session.getName() : "Workout");
        template.setEndTime(session.getEndTime());

        // Convert exercises to template info
        List<WorkoutTemplateResponse.ExerciseTemplateInfo> exerciseInfos = new ArrayList<>();
        
        if (session.getExercises() != null && !session.getExercises().isEmpty()) {
            exerciseInfos = session.getExercises().stream()
                    .filter(ex -> ex.getSets() != null && !ex.getSets().isEmpty())
                    .sorted((a, b) -> {
                        if (a.getOrderIndex() != null && b.getOrderIndex() != null) {
                            return a.getOrderIndex().compareTo(b.getOrderIndex());
                        }
                        return 0;
                    })
                    .map(ex -> {
                        WorkoutTemplateResponse.ExerciseTemplateInfo info = new WorkoutTemplateResponse.ExerciseTemplateInfo();

                        // Determine a base name for this exercise (used for both display name and inference)
                        String baseName = ex.getDisplayName();
                        if (baseName == null && ex.getExerciseDefinition() != null) {
                            baseName = ex.getExerciseDefinition().getName();
                        }
                        if (baseName == null) {
                            baseName = "Exercise";
                        }

                        info.setName(baseName);

                        // Completed sets from this exercise, ordered by set number
                        List<WorkoutSet> completedSets = ex.getSets().stream()
                                .filter(s -> s.getWeightKg() != null && s.getReps() != null && s.isCompleted())
                                .sorted((a, b) -> {
                                    if (a.getSetNumber() != null && b.getSetNumber() != null) {
                                        return a.getSetNumber().compareTo(b.getSetNumber());
                                    }
                                    return 0;
                                })
                                .collect(Collectors.toList());

                        info.setSetCount(completedSets.size());

                        // Map previous sets (weight + reps) for use in \"Previous\" column
                        List<WorkoutTemplateResponse.PreviousSetInfo> previousSetInfos = completedSets.stream()
                                .map(set -> {
                                    WorkoutTemplateResponse.PreviousSetInfo ps = new WorkoutTemplateResponse.PreviousSetInfo();
                                    ps.setWeightKg(set.getWeightKg());
                                    ps.setReps(set.getReps());
                                    return ps;
                                })
                                .collect(Collectors.toList());
                        info.setPreviousSets(previousSetInfos);

                        String muscleGroup = null;
                        if (ex.getExerciseDefinition() != null) {
                            muscleGroup = ex.getExerciseDefinition().getMuscleGroup();
                            info.setEquipment(ex.getExerciseDefinition().getEquipment());
                        }

                        // Prefer explicit muscleGroup from DB; otherwise infer from the base name
                        if (muscleGroup != null && !muscleGroup.trim().isEmpty()) {
                            info.setMuscleGroup(muscleGroup);
                        } else {
                            info.setMuscleGroup(inferMuscleGroup(baseName));
                        }

                        return info;
                    })
                    .collect(Collectors.toList());
        }
        
        template.setExercises(exerciseInfos);
        return template;
    }

    /**
     * Infer muscle group from exercise name if not available.
     */
    private String inferMuscleGroup(String exerciseName) {
        if (exerciseName == null) {
            return "Unknown";
        }
        String name = exerciseName.toLowerCase();

        // Explicit mappings for common exercises we seeded
        if (name.contains("ab wheel rollout")) {
            return "Core";
        }
        if (name.contains("back extension")) {
            return "Back";
        }
        if (name.contains("lat pulldown")) {
            return "Back";
        }
        if (name.contains("bench press")) {
            return "Chest";
        }
        if (name.contains("squat")) {
            return "Legs";
        }
        if (name.contains("deadlift")) {
            return "Full body";
        }
        if (name.contains("chest") || name.contains("bench") || name.contains("push-up") || name.contains("fly")) {
            return "Chest";
        }
        if (name.contains("back") || name.contains("row") || name.contains("pulldown") || name.contains("pull-up") || name.contains("chin-up")) {
            return "Back";
        }
        if (name.contains("leg") || name.contains("squat") || name.contains("lunge") || name.contains("press") && (name.contains("leg") || name.contains("calf"))) {
            return "Legs";
        }
        if (name.contains("shoulder") || name.contains("lateral raise") || name.contains("front raise")) {
            return "Shoulders";
        }
        if (name.contains("bicep") || name.contains("curl")) {
            return "Arms";
        }
        if (name.contains("tricep") || name.contains("extension") || name.contains("pushdown")) {
            return "Arms";
        }
        if (name.contains("cardio") || name.contains("run") || name.contains("bike") || name.contains("elliptical") || name.contains("treadmill")) {
            return "Cardio";
        }
        if (name.contains("core") || name.contains("ab") || name.contains("crunch") || name.contains("plank") || name.contains("sit-up")) {
            return "Core";
        }
        return "Unknown";
    }
}

