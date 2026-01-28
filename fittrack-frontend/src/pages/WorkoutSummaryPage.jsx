import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkoutSummaryPage() {
  const navigate = useNavigate()
  const [workoutData, setWorkoutData] = useState(null)
  const [prCount, setPrCount] = useState(0)
  const [isSavingFavorite, setIsSavingFavorite] = useState(false)
  const [favoriteSaved, setFavoriteSaved] = useState(false)

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

  const handleAddToFavorites = async () => {
    if (!workoutData?.sessionId || favoriteSaved || isSavingFavorite) {
      return
    }

    try {
      setIsSavingFavorite(true)
      const res = await fetch(
        `http://localhost:8080/api/workouts/${workoutData.sessionId}/favorite?value=true`,
        {
          method: 'POST',
        },
      )

      if (res.ok) {
        setFavoriteSaved(true)
      } else {
        // We just log for now; the workout is still saved as a normal session
        console.error('Failed to mark workout as favourite', res.status)
      }
    } catch (err) {
      console.error('Error marking workout as favourite', err)
    } finally {
      setIsSavingFavorite(false)
    }
  }

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
        {/* Exit button */}
        <button
          className="workout-summary-exit-btn"
          onClick={() => navigate('/workouts')}
          aria-label="Exit"
        >
          Exit
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
            <div className="workout-summary-card-title-row">
              <h2 className="workout-summary-card-title">{workoutData.name}</h2>
              <button
                className="workout-summary-favorite-btn"
              title={favoriteSaved ? 'Added to favourites' : 'Add template as favourite'}
              aria-label="Add to favorites"
              disabled={favoriteSaved || isSavingFavorite || !workoutData.sessionId}
              onClick={handleAddToFavorites}
              >
              {favoriteSaved ? '✅' : '⭐'}
              </button>
            </div>
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
