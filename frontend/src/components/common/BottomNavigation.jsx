import { useNavigate, useLocation } from 'react-router-dom'

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  const activeColor = 'rgb(21, 57, 116)' // YU Blue
  const inactiveColor = 'rgb(107, 114, 128)' // gray-600

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {/* 로그아웃 */}
          <button
            onClick={() => navigate('/login')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
            <span className="text-xs text-gray-600">로그아웃</span>
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
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

