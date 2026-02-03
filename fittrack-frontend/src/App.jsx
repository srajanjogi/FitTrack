import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import AttendancePage from './pages/AttendancePage'
import SchedulePage from './pages/SchedulePage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutSessionPage from './pages/WorkoutSessionPage'
import WorkoutSummaryPage from './pages/WorkoutSummaryPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/workouts/summary" element={<WorkoutSummaryPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/session" element={<WorkoutSessionPage />} />
      </Route>
    </Routes>
  )
}

export default App
