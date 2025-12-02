import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import StudentHomePage from '../pages/StudentHomePage'
import AttendancePage from '../pages/AttendancePage'
import AttendanceHistoryPage from '../pages/AttendanceHistoryPage'
import AttendanceDetailPage from '../pages/AttendanceDetailPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student/home" element={<StudentHomePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/student/history" element={<AttendanceHistoryPage />} />
      <Route path="/attendance/detail/:id" element={<AttendanceDetailPage />} />
    </Routes>
  )
}

export default AppRoutes

