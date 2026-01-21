function AttendancePage() {
  const visits = [
    {
      id: 12,
      dateLabel: 'Today, January 12, 2026',
      weekday: 'Friday',
      checkIn: '06:30 AM',
      checkOut: '08:45 AM',
      duration: '2h 15m',
    },
    {
      id: 11,
      dateLabel: 'Yesterday, January 11, 2026',
      weekday: 'Thursday',
      checkIn: '05:45 PM',
      checkOut: '08:10 PM',
      duration: '2h 25m',
    },
    {
      id: 10,
      dateLabel: 'Wednesday, January 10, 2026',
      weekday: 'Wednesday',
      checkIn: '07:00 AM',
      checkOut: '09:30 AM',
      duration: '2h 30m',
    },
    {
      id: 9,
      dateLabel: 'Tuesday, January 9, 2026',
      weekday: 'Tuesday',
      checkIn: '06:15 PM',
      checkOut: '08:00 PM',
      duration: '1h 45m',
    },
    {
      id: 8,
      dateLabel: 'Monday, January 8, 2026',
      weekday: 'Monday',
      checkIn: '06:45 AM',
      checkOut: '09:15 AM',
      duration: '2h 30m',
    },
  ]

  const totalVisits = 156
  const visitsThisMonth = 24
  const currentStreak = 7
  const avgDuration = '2.5h'

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
          <span className="attendance-summary-value">{visitsThisMonth}</span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Current streak</span>
          <span className="attendance-summary-value">{currentStreak}</span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Total visits</span>
          <span className="attendance-summary-value">{totalVisits}</span>
        </div>
        <div className="attendance-summary-card">
          <span className="attendance-summary-label">Avg duration</span>
          <span className="attendance-summary-value">{avgDuration}</span>
        </div>
      </div>

      <div className="attendance-filters">
        <select className="attendance-filter-select" defaultValue="all">
          <option value="all">All time</option>
          <option value="month">This month</option>
          <option value="three">Last 3 months</option>
        </select>
        <input
          className="attendance-filter-search"
          type="text"
          placeholder="Search by date..."
        />
        <button className="attendance-export">Export</button>
      </div>

      <div className="attendance-table-wrapper">
        <div className="attendance-table-header">Visit history</div>
        <div className="attendance-table">
          {visits.map((visit) => (
            <div key={visit.id} className="attendance-row">
              <div className="attendance-date-cell">
                <div className="attendance-date-badge">
                  {visit.id.toString().padStart(2, '0')}
                </div>
                <div className="attendance-date-text">
                  <span className="attendance-date-label">{visit.dateLabel}</span>
                  <span className="attendance-date-weekday">{visit.weekday}</span>
                </div>
              </div>
              <div className="attendance-time-cell">
                <span className="attendance-time-label">Check in</span>
                <span className="attendance-time-value">{visit.checkIn}</span>
              </div>
              <div className="attendance-time-cell">
                <span className="attendance-time-label">Check out</span>
                <span className="attendance-time-value">{visit.checkOut}</span>
              </div>
              <div className="attendance-time-cell">
                <span className="attendance-time-label">Duration</span>
                <span className="attendance-time-value">{visit.duration}</span>
              </div>
              <div className="attendance-status-cell">✔</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttendancePage

