package com.fittrack.backend.workout;

import com.fittrack.backend.auth.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    
    /**
     * Find the most recent workout sessions for a user, ordered by end time descending.
     */
	@Query("SELECT ws FROM WorkoutSession ws " +
		   "WHERE ws.user = :user AND ws.endTime IS NOT NULL " +
		   "ORDER BY ws.endTime DESC")
    List<WorkoutSession> findRecentWorkoutsByUser(@Param("user") User user, Pageable pageable);

	/**
	 * Find the most recent favourite workout sessions for a user.
	 */
	@Query("SELECT ws FROM WorkoutSession ws " +
		   "WHERE ws.user = :user AND ws.endTime IS NOT NULL AND ws.favorite = true " +
		   "ORDER BY ws.endTime DESC")
	List<WorkoutSession> findFavoriteWorkoutsByUser(@Param("user") User user, Pageable pageable);

	/**
	 * All sessions for a user ordered by start time ascending.
	 * Used for attendance statistics.
	 */
	List<WorkoutSession> findByUserOrderByStartTimeAsc(User user);

	/**
	 * Latest sessions for a user ordered by start time descending.
	 * Used for attendance visit history (limited).
	 */
	List<WorkoutSession> findByUserOrderByStartTimeDesc(User user, Pageable pageable);
    
}

