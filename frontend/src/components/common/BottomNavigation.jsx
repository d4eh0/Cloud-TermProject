import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../api/auth'

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  const activeColor = 'rgb(21, 57, 116)' // YU Blue
  const inactiveColor = 'rgb(107, 114, 128)' // gray-600

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 발생해도 로그인 페이지로 이동
      navigate('/login')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 py-2"
          >
            <svg
              className="w-6 h-6"
              style={{ color: inactiveColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span 
              className="text-xs" 
              style={{ color: inactiveColor }}
            >
              로그아웃
            </span>
          </button>
          
          {/* 출석체크 */}
          <button
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <svg
              className="w-6 h-6"
              style={{ color: isActive('/attendance') ? activeColor : inactiveColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span 
              className="text-xs" 
              style={{ color: isActive('/attendance') ? activeColor : inactiveColor }}
            >
              출석체크
            </span>
          </button>

          {/* 오늘의 출결현황 */}
          <button
            onClick={() => navigate('/attendance/today')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <svg
              className="w-6 h-6"
              style={{ color: isActive('/attendance/today') ? activeColor : inactiveColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span 
              className="text-xs" 
              style={{ color: isActive('/attendance/today') ? activeColor : inactiveColor }}
            >
              오늘의 출결현황
            </span>
          </button>

          {/* 과목별 출결현황 */}
          <button
            onClick={() => navigate('/attendance/history')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <svg
              className="w-6 h-6"
              style={{ color: isActive('/attendance/history') ? activeColor : inactiveColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span 
              className="text-xs" 
              style={{ color: isActive('/attendance/history') ? activeColor : inactiveColor }}
            >
              과목별 출결현황
            </span>
          </button>

        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation

