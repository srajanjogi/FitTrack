package com.fittrack.backend.workout;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fittrack.backend.auth.User;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single workout session for a user.
 */
@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = true)
    private String name;

    @Column(nullable = false)
    private Instant startTime;

    @Column(nullable = true)
    private Instant endTime;

    /**
     * Duration of the workout in seconds. Can be derived from start/end but
     * stored for faster queries.
     */
    @Column(nullable = true)
    private Long durationSeconds;

    /**
     * Total volume (sum of weight * reps for all completed sets) for this session.
     */
    @Column(nullable = true)
    private Long totalVolume;

	/**
	 * Whether this session has been marked as a favourite by the user.
	 * Mapped to the existing {@code is_favorite} column in the database.
	 */
	@Column(name = "is_favorite", nullable = false)
	private boolean favorite = false;

    @Column(columnDefinition = "text")
    private String notes;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutExercise> exercises = new ArrayList<>();

    public WorkoutSession() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Long getTotalVolume() {
        return totalVolume;
    }

    public void setTotalVolume(Long totalVolume) {
        this.totalVolume = totalVolume;
    }

	public boolean isFavorite() {
		return favorite;
	}

	public void setFavorite(boolean favorite) {
		this.favorite = favorite;
	}

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<WorkoutExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExercise> exercises) {
        this.exercises = exercises;
    }

    @PrePersist
    public void prePersist() {
        if (startTime == null) {
            startTime = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (startTime != null && endTime != null && durationSeconds == null) {
            durationSeconds = Duration.between(startTime, endTime).getSeconds();
        }
    }
}

