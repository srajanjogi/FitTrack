import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkoutsPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [favoriteTemplates, setFavoriteTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loading, setLoading] = useState(true)

  function getTemplateTitle(template) {
    if (!template?.exercises || template.exercises.length === 0) {
      return 'Workout'
    }

    // Count number of exercises by muscle group (excluding null, empty, Unknown, Other)
    // This makes the title reflect the body part with the MOST exercises for that day.
    const counts = {}
    template.exercises.forEach((ex) => {
      const group = ex.muscleGroup
      if (group && group.trim() && group !== 'Unknown' && group !== 'Other') {
        const key = group.trim()
        // Count each exercise as 1 (not counting sets)
        counts[key] = (counts[key] || 0) + 1
      }
    })

    // Pick the muscle group with the highest exercise count
    let bestGroup = null
    let bestCount = 0
    Object.entries(counts).forEach(([group, count]) => {
      if (count > bestCount) {
        bestGroup = group
        bestCount = count
      }
    })

    // If we found a valid muscle group, capitalize it properly and return
    if (bestGroup) {
      // Capitalize first letter of each word
      return bestGroup
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }

    // If no valid muscle group found, try to infer from first exercise name
    const firstExercise = template.exercises[0]
    if (firstExercise?.name) {
      const name = firstExercise.name.toLowerCase()
      // Simple keyword matching for common body parts
      if (name.includes('chest') || name.includes('bench') || name.includes('push')) {
        return 'Chest'
      }
      if (name.includes('back') || name.includes('row') || name.includes('pulldown') || name.includes('pull')) {
        return 'Back'
      }
      if (name.includes('leg') || name.includes('squat') || name.includes('lunge')) {
        return 'Legs'
      }
      if (name.includes('shoulder') || name.includes('press')) {
        return 'Shoulders'
      }
      if (name.includes('bicep') || name.includes('curl')) {
        return 'Arms'
      }
      if (name.includes('tricep') || name.includes('extension')) {
        return 'Arms'
      }
      if (name.includes('cardio') || name.includes('run') || name.includes('bike')) {
        return 'Cardio'
      }
      if (name.includes('core') || name.includes('ab') || name.includes('crunch')) {
        return 'Core'
      }
    }

    // Last resort: return "Workout" instead of "Afternoon workout"
    return 'Workout'
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      const storedUser = window.localStorage.getItem('fittrackUser')
      const user = storedUser ? JSON.parse(storedUser) : null

      if (user?.id) {
        console.log('Fetching templates for user ID:', user.id)
        const res = await fetch(`http://localhost:8080/api/workouts/templates/${user.id}`)
        console.log('Response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('Templates received:', data)
          setTemplates(data)
        } else {
          const errorText = await res.text()
          console.error('Failed to fetch templates:', res.status, errorText)
        }
      } else {
        console.log('No user ID found in localStorage')
      }
    } catch (err) {
      console.error('Failed to fetch templates', err)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-GB', { month: 'long' })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  function handleTemplateClick(template) {
    setSelectedTemplate(template)
  }

  function handleCloseModal() {
    setSelectedTemplate(null)
  }

  function handleStartWorkout() {
    if (selectedTemplate) {
      // Navigate to workout session with template data
      navigate('/workouts/session', { state: { template: selectedTemplate } })
    }
  }

  return (
    <div className="workouts-layout">
      <div className="workouts-main">
        <div className="workouts-header">
          <div>
            <p className="workouts-new">New in 1.0</p>
            <h1>Start workout</h1>
          </div>
        </div>

        <section className="workouts-section">
          <h2 className="workouts-section-title">Quick start</h2>
          <button
            type="button"
            className="workouts-primary-button"
            onClick={() => navigate('/workouts/session')}
          >
            Start an empty workout
          </button>
        </section>

        {/* Favorite Templates Section */}
        <section className="workouts-section">
          <div className="workouts-section-header">
            <h2 className="workouts-section-title">Favorite templates</h2>
            <div className="workouts-section-actions">
              <button className="workouts-chip-button">+ Template</button>
            </div>
          </div>

          <p className="workouts-subtitle">
            {loading ? 'Loading...' : `My favourite templates (${favoriteTemplates.length})`}
          </p>

          <div className="workouts-template-grid-2x3">
            {Array.from({ length: 6 }, (_, index) => {
              const tpl = favoriteTemplates[index]
              return (
                <div
                  key={tpl?.id || `empty-${index}`}
                  className="workouts-template-card"
                  onClick={() => tpl && handleTemplateClick(tpl)}
                  style={{ cursor: tpl ? 'pointer' : 'default', opacity: tpl ? 1 : 0.5 }}
                >
                  {tpl ? (
                    <>
                      <div className="workouts-template-header">
                        <h3>{getTemplateTitle(tpl)}</h3>
                      </div>
                      <p className="workouts-template-description">
                        {tpl.exercises?.length || 0} exercises
                      </p>
                      <p className="workouts-template-description">
                        ⏱ {formatDate(tpl.endTime)}
                      </p>
                    </>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>No data</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Previous Templates Section */}
        <section className="workouts-section">
          <div className="workouts-section-header">
            <h2 className="workouts-section-title">Previous templates</h2>
            <div className="workouts-section-actions">
              <button className="workouts-chip-button">+ Template</button>
            </div>
          </div>

          <p className="workouts-subtitle">
            {loading ? 'Loading templates...' : `My templates (${templates.length})`}
          </p>

          <div className="workouts-template-grid-2x3">
            {Array.from({ length: 6 }, (_, index) => {
              const tpl = templates[index]
              return (
                <div
                  key={tpl?.id || `empty-${index}`}
                  className="workouts-template-card"
                  onClick={() => tpl && handleTemplateClick(tpl)}
                  style={{ cursor: tpl ? 'pointer' : 'default', opacity: tpl ? 1 : 0.5 }}
                >
                  {tpl ? (
                    <>
                      <div className="workouts-template-header">
                        <h3>{getTemplateTitle(tpl)}</h3>
                      </div>
                      <p className="workouts-template-description">
                        {tpl.exercises?.length || 0} exercises
                      </p>
                      <p className="workouts-template-description">
                        ⏱ {formatDate(tpl.endTime)}
                      </p>
                    </>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>No data</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="workout-template-modal-overlay" onClick={handleCloseModal}>
          <div className="workout-template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="workout-template-modal-header">
              <button className="workout-template-modal-close" onClick={handleCloseModal}>
                ×
              </button>
              <h2 className="workout-template-modal-title">{getTemplateTitle(selectedTemplate)}</h2>
              <button className="workout-template-modal-edit">Edit</button>
            </div>

            <div className="workout-template-modal-content">
              <p className="workout-template-last-performed">
                Last Performed: {formatDate(selectedTemplate.endTime)}
              </p>

              <div className="workout-template-exercises">
                {selectedTemplate.exercises?.map((exercise, index) => (
                  <div key={index} className="workout-template-exercise-item">
                    <div className="workout-template-exercise-icon">💪</div>
                    <div className="workout-template-exercise-info">
                      <div className="workout-template-exercise-name">
                        {exercise.setCount} x {exercise.name}
                      </div>
                      <div className="workout-template-exercise-meta">
                        {exercise.muscleGroup || 'Unknown'}
                        {exercise.equipment && ` • ${exercise.equipment}`}
                      </div>
                    </div>
                    <div className="workout-template-exercise-help">?</div>
                  </div>
                ))}
              </div>

              <button
                className="workout-template-start-button"
                onClick={handleStartWorkout}
              >
                Start Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutsPage

