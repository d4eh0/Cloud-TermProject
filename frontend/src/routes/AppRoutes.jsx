import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import AttendanceTodayPage from '../pages/AttendanceTodayPage'
import AttendancePage from '../pages/AttendancePage'
import AttendanceHistoryPage from '../pages/AttendanceHistoryPage'
import AttendanceDetailPage from '../pages/AttendanceDetailPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/attendance/today" element={<AttendanceTodayPage />} />
      <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
      <Route path="/attendance/history/detail/:id" element={<AttendanceDetailPage />} />
    </Routes>
  )
}

export default AppRoutes

