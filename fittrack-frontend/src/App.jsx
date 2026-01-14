import './App.css'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'
import AttendancePage from './pages/AttendancePage'
import BillingPage from './pages/BillingPage'
import SchedulePage from './pages/SchedulePage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutSessionPage from './pages/WorkoutSessionPage'
import WorkoutSummaryPage from './pages/WorkoutSummaryPage'

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/workouts/summary" element={<WorkoutSummaryPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/session" element={<WorkoutSessionPage />} />
      </Route>
    </Routes>
  )
}

export default App
