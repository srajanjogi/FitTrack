import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkoutSessionPage() {
  const navigate = useNavigate()
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const fullDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  })

  const [showPicker, setShowPicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [sessionExercises, setSessionExercises] = useState([])
  const [openMenu, setOpenMenu] = useState(null) // Track which exercise menu is open
  const [editingNote, setEditingNote] = useState(null) // Track which exercise note is being edited
  const [noteText, setNoteText] = useState('') // Temporary note text while editing
  const [startTime] = useState(Date.now()) // Track when workout started
  const [duration, setDuration] = useState(0) // Duration in seconds

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.workout-exercise-menu-wrapper')) {
        setOpenMenu(null)
        setEditingNote(null)
        setNoteText('')
      }
    }

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenu])

  const exerciseGroups = [
    {
      letter: 'A',
      items: [
        { name: 'Ab wheel rollout', bodyPart: 'Core' },
        { name: 'Aerobics (step / low-impact)', bodyPart: 'Cardio' },
        { name: 'Arnold press (dumbbell)', bodyPart: 'Shoulders' },
      ],
    },
    {
      letter: 'B',
      items: [
        { name: 'Back extension', bodyPart: 'Back' },
        { name: 'Back extension (machine)', bodyPart: 'Back' },
        { name: 'Barbell row (bent-over row)', bodyPart: 'Back' },
        { name: 'Bench press (barbell)', bodyPart: 'Chest' },
        { name: 'Bench press (dumbbell)', bodyPart: 'Chest' },
        { name: 'Bicep curl (dumbbell)', bodyPart: 'Arms' },
        { name: 'Bulgarian split squat', bodyPart: 'Legs' },
      ],
    },
    {
      letter: 'C',
      items: [
        { name: 'Cable row (seated)', bodyPart: 'Back' },
        { name: 'Calf raise (standing)', bodyPart: 'Calves' },
        { name: 'Chest fly (dumbbell)', bodyPart: 'Chest' },
        { name: 'Chin-up', bodyPart: 'Back' },
        { name: 'Crunch', bodyPart: 'Core' },
      ],
    },
    {
      letter: 'D',
      items: [
        { name: 'Deadlift (conventional)', bodyPart: 'Full body' },
        { name: 'Dumbbell shoulder press', bodyPart: 'Shoulders' },
        { name: 'Dumbbell lateral raise', bodyPart: 'Shoulders' },
      ],
    },
    {
      letter: 'E',
      items: [
        { name: 'Elliptical', bodyPart: 'Cardio' },
        { name: 'EZ-bar curl', bodyPart: 'Arms' },
        { name: 'Exercise bike', bodyPart: 'Cardio' },
      ],
    },
    {
      letter: 'F',
      items: [
        { name: 'Face pull', bodyPart: 'Shoulders' },
        { name: 'Farmer’s walk', bodyPart: 'Full body' },
        { name: 'Front squat', bodyPart: 'Legs' },
      ],
    },
    {
      letter: 'G',
      items: [
        { name: 'Glute bridge / hip thrust', bodyPart: 'Glutes' },
        { name: 'Goblet squat', bodyPart: 'Legs' },
        { name: 'Good morning', bodyPart: 'Back' },
      ],
    },
    {
      letter: 'H',
      items: [
        { name: 'Hammer curl', bodyPart: 'Arms' },
        { name: 'Hack squat (machine)', bodyPart: 'Legs' },
        { name: 'High knees', bodyPart: 'Cardio' },
      ],
    },
    {
      letter: 'J',
      items: [
        { name: 'Jump rope', bodyPart: 'Cardio' },
        { name: 'Jump squat', bodyPart: 'Legs' },
      ],
    },
    {
      letter: 'K',
      items: [
        { name: 'Kettlebell swing', bodyPart: 'Full body' },
        { name: 'Kettlebell goblet squat', bodyPart: 'Legs' },
      ],
    },
    {
      letter: 'L',
      items: [
        { name: 'Lat pulldown', bodyPart: 'Back' },
        { name: 'Leg press', bodyPart: 'Legs' },
        { name: 'Leg curl', bodyPart: 'Legs' },
        { name: 'Leg extension', bodyPart: 'Legs' },
        { name: 'Lunge (walking)', bodyPart: 'Legs' },
      ],
    },
    {
      letter: 'M',
      items: [
        { name: 'Mountain climber', bodyPart: 'Cardio' },
        { name: 'Machine chest press', bodyPart: 'Chest' },
      ],
    },
    {
      letter: 'O',
      items: [{ name: 'Overhead press (barbell)', bodyPart: 'Shoulders' }],
    },
    {
      letter: 'P',
      items: [
        { name: 'Plank', bodyPart: 'Core' },
        { name: 'Pull-up', bodyPart: 'Back' },
        { name: 'Push-up', bodyPart: 'Chest' },
        { name: 'Pec deck (chest fly machine)', bodyPart: 'Chest' },
      ],
    },
    {
      letter: 'R',
      items: [
        { name: 'Romanian deadlift', bodyPart: 'Hamstrings' },
        { name: 'Row (machine)', bodyPart: 'Back' },
        { name: 'Russian twist', bodyPart: 'Core' },
      ],
    },
    {
      letter: 'S',
      items: [
        { name: 'Squat (back)', bodyPart: 'Legs' },
        { name: 'Shoulder press (machine)', bodyPart: 'Shoulders' },
        { name: 'Step-up', bodyPart: 'Legs' },
        { name: 'Skull crusher / triceps extension', bodyPart: 'Arms' },
      ],
    },
    {
      letter: 'T',
      items: [
        { name: 'T-bar row', bodyPart: 'Back' },
        { name: 'Tricep pushdown (cable)', bodyPart: 'Arms' },
      ],
    },
    {
      letter: 'W',
      items: [
        { name: 'Walking lunge', bodyPart: 'Legs' },
        { name: 'Wall sit', bodyPart: 'Legs' },
      ],
    },
  ]

  // Filter exercises based on search query
  const filteredGroups = exerciseGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0)

  // Handle exercise selection (single selection only)
  const handleExerciseClick = (exerciseName) => {
    setSelectedExercise((prev) => {
      // If clicking the same exercise, deselect it
      if (prev === exerciseName) {
        return null
      }
      // Otherwise, select the new exercise (this automatically deselects the previous one)
      return exerciseName
    })
  }

  // Add a new exercise (with one empty set) to the current session
  const handleAddExerciseToSession = () => {
    if (!selectedExercise) return

    setSessionExercises((prev) => {
      // Avoid duplicates – if already added, just return previous
      if (prev.some((ex) => ex.name === selectedExercise)) {
        return prev
      }
      return [
        ...prev,
        {
          name: selectedExercise,
          sets: [{ id: 1, weight: '', reps: '', prevWeight: '', prevReps: '', confirmed: false }],
          note: '',
        },
      ]
    })

    setShowPicker(false)
    setSearchQuery('')
    setSelectedExercise(null)
  }

  const handleAddSet = (exerciseName) => {
    setSessionExercises((prev) =>
      prev.map((ex) => {
        if (ex.name !== exerciseName) return ex
        const nextId = ex.sets.length + 1
        const last = ex.sets[ex.sets.length - 1]
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: nextId,
              weight: '',
              reps: '',
              prevWeight: last.weight,
              prevReps: last.reps,
              confirmed: false,
            },
          ],
        }
      }),
    )
  }

  const handleSetChange = (exerciseName, setId, field, value) => {
    setSessionExercises((prev) =>
      prev.map((ex) => {
        if (ex.name !== exerciseName) return ex
        return {
          ...ex,
          sets: ex.sets.map((set) =>
            set.id === setId && !set.confirmed
              ? {
                  ...set,
                  [field]: value,
                }
              : set,
          ),
        }
      }),
    )
  }

  const handleConfirmSet = (exerciseName, setId) => {
    setSessionExercises((prev) =>
      prev.map((ex) => {
        if (ex.name !== exerciseName) return ex
        return {
          ...ex,
          sets: ex.sets.map((set) =>
            set.id === setId
              ? {
                  ...set,
                  confirmed: true,
                }
              : set,
          ),
        }
      }),
    )
  }

  const handleRemoveExercise = (exerciseName) => {
    setSessionExercises((prev) => prev.filter((ex) => ex.name !== exerciseName))
    setOpenMenu(null)
  }

  const handleToggleMenu = (exerciseName) => {
    if (openMenu === exerciseName) {
      setOpenMenu(null)
    } else {
      setOpenMenu(exerciseName)
      const exercise = sessionExercises.find((ex) => ex.name === exerciseName)
      setNoteText(exercise?.note || '')
    }
  }

  const handleSaveNote = (exerciseName) => {
    setSessionExercises((prev) =>
      prev.map((ex) => (ex.name === exerciseName ? { ...ex, note: noteText } : ex)),
    )
    setEditingNote(null)
    setNoteText('')
    setOpenMenu(null)
  }

  const handleStartEditNote = (exerciseName) => {
    const exercise = sessionExercises.find((ex) => ex.name === exerciseName)
    setEditingNote(exerciseName)
    setNoteText(exercise?.note || '')
  }

  const calculateAverages = (exerciseName) => {
    const exercise = sessionExercises.find((ex) => ex.name === exerciseName)
    if (!exercise) return { avgWeight: 0, avgReps: 0 }

    const confirmedSets = exercise.sets.filter((set) => set.confirmed && set.weight && set.reps)
    if (confirmedSets.length === 0) return { avgWeight: 0, avgReps: 0 }

    const totalWeight = confirmedSets.reduce((sum, set) => sum + parseFloat(set.weight) || 0, 0)
    const totalReps = confirmedSets.reduce((sum, set) => sum + parseFloat(set.reps) || 0, 0)

    return {
      avgWeight: (totalWeight / confirmedSets.length).toFixed(1),
      avgReps: (totalReps / confirmedSets.length).toFixed(1),
    }
  }

  const handleFinish = () => {
    // Calculate total weight lifted (weight × reps for all confirmed sets)
    let totalWeight = 0
    const exerciseSummaries = []

    sessionExercises.forEach((ex) => {
      const confirmedSets = ex.sets.filter((set) => set.confirmed && set.weight && set.reps)
      if (confirmedSets.length === 0) return

      // Calculate total weight for this exercise
      const exerciseTotal = confirmedSets.reduce(
        (sum, set) => sum + parseFloat(set.weight) * parseFloat(set.reps),
        0,
      )
      totalWeight += exerciseTotal

      // Find best set (highest weight × reps)
      let bestSet = null
      let bestValue = 0
      confirmedSets.forEach((set) => {
        const value = parseFloat(set.weight) * parseFloat(set.reps)
        if (value > bestValue) {
          bestValue = value
          bestSet = set
        }
      })

      exerciseSummaries.push({
        name: ex.name,
        setCount: confirmedSets.length,
        bestSet: bestSet
          ? {
              weight: parseFloat(bestSet.weight),
              reps: parseFloat(bestSet.reps),
              value: bestValue,
            }
          : null,
      })
    })

    // Get workout count from localStorage
    const workoutCount = parseInt(localStorage.getItem('workoutCount') || '0') + 1
    localStorage.setItem('workoutCount', workoutCount.toString())

    // Store workout data for summary page
    const workoutData = {
      name: 'Afternoon workout',
      date: fullDate,
      duration: formatDuration(duration),
      durationSeconds: duration,
      totalWeight: Math.round(totalWeight),
      exercises: exerciseSummaries,
      workoutCount,
    }

    // Store in sessionStorage to pass to summary page
    sessionStorage.setItem('workoutSummary', JSON.stringify(workoutData))

    // Navigate to summary page
    navigate('/workouts/summary')
  }

  return (
    <div className="workout-session-root">
      <div className="workout-session-card">
        <div className="workout-session-header">
          <div className="workout-session-timer-icon">⏱</div>
          <button className="workout-session-finish" onClick={handleFinish}>
            Finish
          </button>
        </div>

        <div className="workout-session-title-block">
          <h1>Afternoon workout</h1>
          <p className="workout-session-meta">
            <span>{formattedDate}</span>
            <span>{formatDuration(duration)}</span>
          </p>
        </div>

        {sessionExercises.length > 0 && (
          <div className="workout-exercises-list">
            {sessionExercises.map((ex) => {
              const averages = calculateAverages(ex.name)
              const isMenuOpen = openMenu === ex.name
              const isEditingNote = editingNote === ex.name

              return (
                <div key={ex.name} className="workout-exercise-block">
                  <div className="workout-exercise-header">
                    <span className="workout-exercise-name">{ex.name}</span>
                    <div className="workout-exercise-menu-wrapper">
                      <button
                        type="button"
                        className="workout-exercise-menu-btn"
                        onClick={() => handleToggleMenu(ex.name)}
                      >
                        ⋯
                      </button>
                      {isMenuOpen && (
                        <div className="workout-exercise-menu">
                          <div className="workout-menu-stats">
                            <div className="workout-menu-stat">
                              <span className="workout-menu-stat-label">Avg Weight</span>
                              <span className="workout-menu-stat-value">{averages.avgWeight} kg</span>
                            </div>
                            <div className="workout-menu-stat">
                              <span className="workout-menu-stat-label">Avg Reps</span>
                              <span className="workout-menu-stat-value">{averages.avgReps}</span>
                            </div>
                          </div>
                          {isEditingNote ? (
                            <div className="workout-menu-note-edit">
                              <textarea
                                className="workout-menu-note-input"
                                placeholder="Add a note..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={3}
                              />
                              <div className="workout-menu-note-actions">
                                <button
                                  type="button"
                                  className="workout-menu-btn-secondary"
                                  onClick={() => {
                                    setEditingNote(null)
                                    setNoteText('')
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="workout-menu-btn-primary"
                                  onClick={() => handleSaveNote(ex.name)}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="workout-menu-item"
                                onClick={() => handleStartEditNote(ex.name)}
                              >
                                {ex.note ? 'Edit Note' : 'Add Note'}
                              </button>
                              <button
                                type="button"
                                className="workout-menu-item workout-menu-item-danger"
                                onClick={() => handleRemoveExercise(ex.name)}
                              >
                                Remove Exercise
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {ex.note && !isEditingNote && (
                    <div className="workout-exercise-note-display">{ex.note}</div>
                  )}
                <div className="workout-exercise-table">
                  <div className="workout-exercise-row workout-exercise-row-head">
                    <span>Set</span>
                    <span>Previous</span>
                    <span>+kg</span>
                    <span>Reps</span>
                    <span />
                  </div>
                  {ex.sets.map((set, idx) => {
                    const hasPrev = set.prevWeight && set.prevReps
                    const prevLabel = hasPrev ? `${set.prevWeight} kg x ${set.prevReps}` : '—'
                    return (
                      <div key={set.id} className="workout-exercise-row">
                        <span className="workout-set-pill">{idx + 1}</span>
                        <span className="workout-exercise-prev">{prevLabel}</span>
                        <input
                          className="workout-input"
                          placeholder="kg"
                          value={set.weight}
                          disabled={set.confirmed}
                          onChange={(e) =>
                            handleSetChange(ex.name, set.id, 'weight', e.target.value)
                          }
                        />
                        <input
                          className="workout-input"
                          placeholder="reps"
                          value={set.reps}
                          disabled={set.confirmed}
                          onChange={(e) =>
                            handleSetChange(ex.name, set.id, 'reps', e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className={`workout-set-confirm ${
                            set.confirmed ? 'workout-set-confirm-active' : ''
                          }`}
                          disabled={!set.weight || !set.reps || set.confirmed}
                          onClick={() => handleConfirmSet(ex.name, set.id)}
                        >
                          ✓
                        </button>
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    className="workout-add-set"
                    onClick={() => handleAddSet(ex.name)}
                  >
                    + Add set
                  </button>
                </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="workout-session-actions">
          <button
            className="workout-session-primary"
            type="button"
            onClick={() => setShowPicker(true)}
          >
            Add exercises
          </button>
          <button className="workout-session-secondary" type="button">
            Cancel workout
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="exercise-picker-overlay">
          <div className="exercise-picker">
            <div className="exercise-picker-header">
              <button
                type="button"
                className="exercise-picker-close"
                onClick={() => {
                  setShowPicker(false)
                  setSearchQuery('')
                  setSelectedExercise(null)
                }}
              >
                ✕
              </button>
              <span className="exercise-picker-title">New</span>
              <button
                type="button"
                className={`exercise-picker-add ${selectedExercise ? 'exercise-picker-add-active' : ''}`}
                disabled={!selectedExercise}
                onClick={handleAddExerciseToSession}
              >
                Add
              </button>
            </div>

            <div className="exercise-picker-search">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="exercise-picker-filters">
              <button type="button">Any body part</button>
              <button type="button">Any category</button>
            </div>

            <div className="exercise-picker-list">
              {filteredGroups.map((group) => (
                <div key={group.letter}>
                  <div className="exercise-picker-section-label">{group.letter}</div>
                  {group.items.map((ex) => {
                    const isSelected = selectedExercise === ex.name
                    return (
                      <button
                        key={ex.name}
                        type="button"
                        className={`exercise-picker-row ${isSelected ? 'exercise-picker-row-selected' : ''}`}
                        onClick={() => handleExerciseClick(ex.name)}
                      >
                        <div className="exercise-picker-row-main">
                          <span className="exercise-picker-name">{ex.name}</span>
                          <span className="exercise-picker-bodypart">{ex.bodyPart}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutSessionPage

