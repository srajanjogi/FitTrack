import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkoutsPage() {
  const navigate = useNavigate()
  const [templates] = useState([
    {
      id: 1,
      name: 'Back',
      description: 'Lat pulldown, rows, and accessory movements focused on your back.',
    },
    {
      id: 2,
      name: 'Chest',
      description: 'Push ups, bench press variations, and chest accessories.',
    },
    {
      id: 3,
      name: 'Legs',
      description: 'Squats, presses, and hamstring work for lower body strength.',
    },
  ])

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

        <section className="workouts-section">
          <div className="workouts-section-header">
            <h2 className="workouts-section-title">Templates</h2>
            <div className="workouts-section-actions">
              <button className="workouts-chip-button">+ Template</button>
            </div>
          </div>

          <p className="workouts-subtitle">My templates ({templates.length})</p>

          <div className="workouts-template-grid">
            {templates.map((tpl) => (
              <div key={tpl.id} className="workouts-template-card">
                <div className="workouts-template-header">
                  <h3>{tpl.name}</h3>
                </div>
                <p className="workouts-template-description">{tpl.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default WorkoutsPage

