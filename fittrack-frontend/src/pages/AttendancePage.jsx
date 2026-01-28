import { useEffect, useState } from 'react'

function AttendancePage() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const [stats, setStats] = useState({
    visitsThisMonth: 0,
    currentStreakDays: 0,
    totalVisits: 0,
    averageDurationSeconds: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [visits, setVisits] = useState([])

  const totalVisits = stats.totalVisits
  const visitsThisMonth = stats.visitsThisMonth
  const currentStreak = stats.currentStreakDays

  const formatAvgDuration = () => {
    if (!stats.averageDurationSeconds || stats.averageDurationSeconds <= 0) {
      return '0h'
    }
    const hours = stats.averageDurationSeconds / 3600
    return `${hours.toFixed(1)}h`
  }

  const avgDuration = formatAvgDuration()

  // Calendar helpers
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const buildMonthDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const firstWeekday = firstDay.getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    // leading blanks
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null)
    }
    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day))
    }
    return cells
  }

  const monthCells = buildMonthDays()

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    )
  }

  const handleSelectDate = (dateObj) => {
    if (!dateObj) return
    setSelectedDate(dateObj)
    setShowCalendar(false)
  }

  const handleClearDate = () => {
    setSelectedDate(null)
    setShowCalendar(false)
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    return selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  useEffect(() => {
    const storedUser = window.localStorage.getItem('fittrackUser')
    const user = storedUser ? JSON.parse(storedUser) : null

    if (!user?.id) {
      setIsLoadingStats(false)
      return
    }

    const fetchStatsAndVisits = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/workouts/attendance/stats/${user.id}`,
        )
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        } else {
          console.error('Failed to load attendance stats', res.status)
        }

        const visitsRes = await fetch(
          `http://localhost:8080/api/workouts/attendance/visits/${user.id}?limit=50`,
        )
        if (visitsRes.ok) {
          const visitData = await visitsRes.json()
          setVisits(visitData)
        } else {
          console.error('Failed to load attendance visits', visitsRes.status)
        }
      } catch (err) {
        console.error('Error loading attendance stats', err)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStatsAndVisits()
  }, [])

  return (
    <div className="attendance-root">
      <div className="attendance-header">
        <div>
          <h1>My attendance</h1>
          <p>Track your gym visits and maintain your fitness streak.</p>
        </div>
      </div>

      <div className="attendance-summary-grid">
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">This month</span>
          <span className="attendance-summary-value">
            {isLoadingStats ? '—' : visitsThisMonth}
          </span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Current streak</span>
          <span className="attendance-summary-value">
            {isLoadingStats ? '—' : currentStreak}
          </span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Total visits</span>
          <span className="attendance-summary-value">
            {isLoadingStats ? '—' : totalVisits}
          </span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Avg duration</span>
          <span className="attendance-summary-value">
            {isLoadingStats ? '—' : avgDuration}
          </span>
        </div>
      </div>

      <div className="attendance-filters">
        <select className="attendance-filter-select" defaultValue="all">
          <option value="all">All time</option>
          <option value="month">This month</option>
          <option value="three">Last 3 months</option>
        </select>

        <div className="attendance-date-picker">
          <label className="attendance-date-label">Select date</label>
          <button
            type="button"
            className="attendance-date-input"
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            <span className="attendance-date-text">
              {formatSelectedDate() || 'Choose a date'}
            </span>
            <span className="attendance-date-icon">📅</span>
          </button>

          {showCalendar && (
            <div className="attendance-calendar-popup">
              <div className="attendance-calendar-header">
                <button
                  type="button"
                  className="attendance-calendar-nav"
                  onClick={handlePrevMonth}
                >
                  ‹
                </button>
                <span className="attendance-calendar-title">
                  {monthFormatter.format(currentMonth)}
                </span>
                <button
                  type="button"
                  className="attendance-calendar-nav"
                  onClick={handleNextMonth}
                >
                  ›
                </button>
              </div>

              <div className="attendance-calendar-weekdays">
                {weekdayLabels.map((day) => (
                  <span key={day} className="attendance-calendar-weekday">
                    {day}
                  </span>
                ))}
              </div>

              <div className="attendance-calendar-grid">
                {monthCells.map((dateObj, index) => {
                  const isSelected =
                    selectedDate &&
                    dateObj &&
                    selectedDate.toDateString() === dateObj.toDateString()
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`attendance-calendar-cell${
                        dateObj ? ' attendance-calendar-cell-active' : ''
                      }${isSelected ? ' attendance-calendar-cell-selected' : ''}`}
                      onClick={() => handleSelectDate(dateObj)}
                      disabled={!dateObj}
                    >
                      {dateObj ? dateObj.getDate() : ''}
                    </button>
                  )
                })}
              </div>

              <div className="attendance-calendar-footer">
                <button
                  type="button"
                  className="attendance-calendar-footer-btn"
                  onClick={() => handleSelectDate(new Date())}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="attendance-calendar-footer-btn"
                  onClick={handleClearDate}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="attendance-export">Export</button>
      </div>

      <div className="attendance-table-wrapper">
        <div className="attendance-table-header">Visit history</div>
        <div className="attendance-table">
          {visits.map((visit) => {
            const start = visit.startTime ? new Date(visit.startTime) : null
            const end = visit.endTime ? new Date(visit.endTime) : null

            const dateLabel = start
              ? start.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''

            const weekday = start
              ? start.toLocaleDateString('en-US', { weekday: 'long' })
              : ''

            const formatTime = (d) =>
              d
                ? d.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '--'

            const durationSeconds = visit.durationSeconds || 0
            const hrs = Math.floor(durationSeconds / 3600)
            const mins = Math.floor((durationSeconds % 3600) / 60)
            const durationLabel =
              durationSeconds > 0 ? `${hrs}h ${mins}m` : '--'

            return (
              <div key={visit.id} className="attendance-row">
                <div className="attendance-date-cell">
                  <div className="attendance-date-badge">
                    {start ? String(start.getDate()).padStart(2, '0') : '--'}
                  </div>
                  <div className="attendance-date-text">
                    <span className="attendance-date-label">{dateLabel}</span>
                    <span className="attendance-date-weekday">{weekday}</span>
                  </div>
                </div>
                <div className="attendance-time-cell">
                  <span className="attendance-time-label">Check in</span>
                  <span className="attendance-time-value">
                    {formatTime(start)}
                  </span>
                </div>
                <div className="attendance-time-cell">
                  <span className="attendance-time-label">Check out</span>
                  <span className="attendance-time-value">
                    {formatTime(end)}
                  </span>
                </div>
                <div className="attendance-time-cell">
                  <span className="attendance-time-label">Duration</span>
                  <span className="attendance-time-value">{durationLabel}</span>
                </div>
                <div className="attendance-status-cell">✔</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AttendancePage

