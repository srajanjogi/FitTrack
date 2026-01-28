package com.fittrack.backend.workout.dto;

/**
 * Simple DTO for aggregated attendance / workout statistics for a user.
 */
public class AttendanceStatsResponse {

    /** Number of days in the current month where the user completed at least one workout. */
    private int visitsThisMonth;

    /** Current streak of consecutive days with at least one workout (ending on the most recent workout day). */
    private int currentStreakDays;

    /** Total number of recorded workout sessions for this user. */
    private long totalVisits;

    /** Average workout duration in seconds across all sessions (0 if no duration data). */
    private long averageDurationSeconds;

    public int getVisitsThisMonth() {
        return visitsThisMonth;
    }

    public void setVisitsThisMonth(int visitsThisMonth) {
        this.visitsThisMonth = visitsThisMonth;
    }

    public int getCurrentStreakDays() {
        return currentStreakDays;
    }

    public void setCurrentStreakDays(int currentStreakDays) {
        this.currentStreakDays = currentStreakDays;
    }

    public long getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(long totalVisits) {
        this.totalVisits = totalVisits;
    }

    public long getAverageDurationSeconds() {
        return averageDurationSeconds;
    }

    public void setAverageDurationSeconds(long averageDurationSeconds) {
        this.averageDurationSeconds = averageDurationSeconds;
    }
}

