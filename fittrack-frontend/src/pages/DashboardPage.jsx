function DashboardPage() {
  return (
    <div className="dashboard-root">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Overview</h1>
            <p className="dashboard-subtitle">
              Set goals, track your progress and stay on top of your training.
            </p>
          </div>
          <div className="dashboard-header-avatars">
            <button type="button" className="dashboard-icon-button">
              🔔
            </button>
            <button type="button" className="dashboard-icon-button">
              +
            </button>
          </div>
        </header>

        <section className="dashboard-hero-card">
          <div className="dashboard-hero-left">
            <p className="dashboard-hero-kicker">Today&apos;s focus</p>
            <h2 className="dashboard-hero-title">Set goals and\nmotivate yourself</h2>
            <button type="button" className="dashboard-hero-button">
              Create goal
            </button>
          </div>
          <div className="dashboard-hero-right">
            <div className="dashboard-hero-figure">🏋️</div>
          </div>
        </section>

        <section className="dashboard-metrics-grid">
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-header">
              <span className="dashboard-metric-icon">❤️</span>
              <span className="dashboard-metric-status good">Good</span>
            </div>
            <div className="dashboard-metric-value-row">
              <span className="dashboard-metric-value">65</span>
              <span className="dashboard-metric-unit">bpm</span>
            </div>
            <p className="dashboard-metric-label">Resting heart rate</p>
          </div>

          <div className="dashboard-metric-card">
            <div className="dashboard-metric-header">
              <span className="dashboard-metric-icon">🔥</span>
              <span className="dashboard-metric-status good">Good</span>
            </div>
            <div className="dashboard-metric-value-row">
              <span className="dashboard-metric-value">1260</span>
              <span className="dashboard-metric-unit">kcal</span>
            </div>
            <p className="dashboard-metric-label">Calories burnt today</p>
          </div>

          <div className="dashboard-metric-card">
            <div className="dashboard-metric-header">
              <span className="dashboard-metric-icon">💧</span>
              <span className="dashboard-metric-status low">Low</span>
            </div>
            <div className="dashboard-metric-value-row">
              <span className="dashboard-metric-value">78</span>
              <span className="dashboard-metric-unit">%</span>
            </div>
            <p className="dashboard-metric-label">Current hydration</p>
          </div>

          <div className="dashboard-metric-card">
            <div className="dashboard-metric-header">
              <span className="dashboard-metric-icon">⚡</span>
              <span className="dashboard-metric-status good">Good</span>
            </div>
            <div className="dashboard-metric-value-row">
              <span className="dashboard-metric-value">95</span>
              <span className="dashboard-metric-unit">%</span>
            </div>
            <p className="dashboard-metric-label">Stamina</p>
          </div>
        </section>
      </div>

      <aside className="dashboard-side">
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Gain weight</h3>
            <span className="dashboard-card-subtitle">Goal</span>
          </div>

          <div className="dashboard-weight-row">
            <div>
              <span className="dashboard-weight-label">From</span>
              <div className="dashboard-weight-value-row">
                <span className="dashboard-weight-value">75</span>
                <span className="dashboard-weight-unit">kg</span>
              </div>
            </div>
            <div>
              <span className="dashboard-weight-label">To</span>
              <div className="dashboard-weight-value-row">
                <span className="dashboard-weight-value">80</span>
                <span className="dashboard-weight-unit">kg</span>
              </div>
            </div>
          </div>

          <div className="dashboard-line-chart">
            <div className="dashboard-line-chart-track">
              <div className="dashboard-line-chart-progress" />
            </div>
            <div className="dashboard-line-chart-footer">
              <div>
                <span className="dashboard-line-chart-label">Gained</span>
                <span className="dashboard-line-chart-value">+3.2 kg</span>
              </div>
              <div>
                <span className="dashboard-line-chart-label">Left</span>
                <span className="dashboard-line-chart-value">1.8 kg</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Activity</h3>
            <span className="dashboard-card-subtitle">This week</span>
          </div>

          <div className="dashboard-bars">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="dashboard-bar-column">
                <div
                  className={`dashboard-bar ${index === 4 ? 'dashboard-bar-highlight' : ''}`}
                  style={{ height: `${40 + index * 8}px` }}
                />
                <span className="dashboard-bar-label">{day[0]}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

export default DashboardPage

