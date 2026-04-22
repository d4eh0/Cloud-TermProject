import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import AttendanceTodayPage from '../pages/AttendanceTodayPage'
import AttendancePage from '../pages/AttendancePage'
import AttendanceHistoryPage from '../pages/AttendanceHistoryPage'
import AttendanceDetailPage from '../pages/AttendanceDetailPage'
import LoadTestPage from '../pages/LoadTestPage'
import FilePage from '../pages/FilePage'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/today"
        element={
          <ProtectedRoute>
            <AttendanceTodayPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/history"
        element={
          <ProtectedRoute>
            <AttendanceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance/history/detail/:id"
        element={
          <ProtectedRoute>
            <AttendanceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/load-test"
        element={
          <ProtectedRoute>
            <LoadTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <FilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes

