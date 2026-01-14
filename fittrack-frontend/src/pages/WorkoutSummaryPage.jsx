import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkoutSummaryPage() {
  const navigate = useNavigate()
  const [workoutData, setWorkoutData] = useState(null)
  const [prCount, setPrCount] = useState(0)

  useEffect(() => {
    // Get workout data from sessionStorage
    const data = sessionStorage.getItem('workoutSummary')
    if (!data) {
      // If no data, redirect back to workouts
      navigate('/workouts')
      return
    }

    const parsed = JSON.parse(data)
    setWorkoutData(parsed)

    // Calculate PRs (for now, we'll show a count based on exercises with best sets)
    // In a real app, this would compare against previous workouts
    const prs = parsed.exercises.filter((ex) => ex.bestSet !== null).length
    setPrCount(prs)
  }, [navigate])

  if (!workoutData) {
    return null
  }

  const formatWeight = (weight) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}k kg`
    }
    return `${weight} kg`
  }

  const formatDuration = (duration) => {
    const parts = duration.split(':')
    const mins = parseInt(parts[0])
    if (mins < 60) {
      return `${mins}m`
    }
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
  }

  return (
    <div className="workout-summary-root">
      <div className="workout-summary-container">
        {/* Close button */}
        <button
          className="workout-summary-close"
          onClick={() => navigate('/workouts')}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Achievement Section */}
        <div className="workout-summary-achievement">
          <div className="workout-summary-stars">
            <span className="workout-summary-star">⭐</span>
            <span className="workout-summary-star workout-summary-star-large">⭐</span>
            <span className="workout-summary-star">⭐</span>
          </div>
          <h1 className="workout-summary-title">Great Job!</h1>
          <p className="workout-summary-subtitle">
            That's your {workoutData.workoutCount}
            {workoutData.workoutCount === 1
              ? 'st'
              : workoutData.workoutCount === 2
                ? 'nd'
                : workoutData.workoutCount === 3
                  ? 'rd'
                  : 'th'}{' '}
            workout!
          </p>
        </div>

        {/* Workout Details Card */}
        <div className="workout-summary-card">
          <div className="workout-summary-card-header">
            <h2 className="workout-summary-card-title">{workoutData.name}</h2>
            <p className="workout-summary-card-date">{workoutData.date}</p>
          </div>

          {/* Summary Statistics */}
          <div className="workout-summary-stats">
            <div className="workout-summary-stat">
              <span className="workout-summary-stat-icon">⏱</span>
              <span className="workout-summary-stat-value">
                {formatDuration(workoutData.duration)}
              </span>
            </div>
            <div className="workout-summary-stat">
              <span className="workout-summary-stat-icon">🏋</span>
              <span className="workout-summary-stat-value">
                {formatWeight(workoutData.totalWeight)}
              </span>
            </div>
            <div className="workout-summary-stat">
              <span className="workout-summary-stat-icon">🏆</span>
              <span className="workout-summary-stat-value">{prCount} PRs</span>
            </div>
          </div>

          {/* Exercise List */}
          <div className="workout-summary-exercises">
            <div className="workout-summary-exercise-header">
              <span>Exercise</span>
              <span>Best Set</span>
            </div>
            {workoutData.exercises.map((ex, idx) => (
              <div key={idx} className="workout-summary-exercise-row">
                <span className="workout-summary-exercise-name">
                  {ex.setCount} x {ex.name}
                </span>
                <span className="workout-summary-exercise-best">
                  {ex.bestSet
                    ? `${ex.bestSet.weight} kg x ${ex.bestSet.reps}`
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PR Button */}
        {prCount > 0 && (
          <button
            className="workout-summary-pr-button"
            onClick={() => navigate('/workouts')}
          >
            <span className="workout-summary-pr-icon">🏆</span>
            <span>{prCount} Personal Records</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default WorkoutSummaryPage
