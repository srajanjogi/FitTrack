import { NavLink, Outlet } from 'react-router-dom'
import '../App.css'

function AppLayout() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-logo">FitTrack</div>
        <div className="app-header-right">Admin</div>
      </header>
      <div className="app-body">
        <nav className="app-sidebar">
          <h2 className="sidebar-title">Navigation</h2>
          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance"
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/workouts"
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                Workouts
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout

