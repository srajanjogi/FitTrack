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
    
}

