import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'

function AttendanceTodayPage() {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock 학생 정보
  const studentInfo = {
    name: '박대형',
    department: '컴퓨터공학과',
    studentId: '22213482',
  }

  // Mock 오늘의 수업 목록
  const todayLectures = [
    {
      id: 1,
      courseName: '데이터베이스',
      date: '2025-12-02(화)',
      time: '11:00 ~ 12:15',
      location: 'IT관(E21-114)',
      attendanceStatus: '미확인',
      attendanceTime: null,
    },
    {
      id: 2,
      courseName: '운영체제',
      date: '2025-12-02(화)',
      time: '13:00 ~ 14:15',
      location: 'IT관(E21-114)',
      attendanceStatus: '지각',
      attendanceTime: '13:05',
    },
    {
      id: 3,
      courseName: '컴퓨터구조',
      date: '2025-12-02(화)',
      time: '13:00 ~ 14:15',
      location: 'IT관(E21-114)',
      attendanceStatus: '결석',
      attendanceTime: null,
    },
    {
      id: 4,
      courseName: '클라우드컴퓨팅',
      date: '2025-12-02(화)',
      time: '15:00 ~ 16:15',
      location: 'IT관(E21-114)',
      attendanceStatus: '출석',
      attendanceTime: '14:56',
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // TODO: 실제 API 호출로 출석 현황 갱신
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsRefreshing(false)
  }

  const handleAttendanceClick = (lecture) => {
    // 미확인 상태가 아닐 때만 클릭 가능 (추후 출석 가능 시간대 체크 추가)
    if (lecture.attendanceStatus === '미확인') {
      return
    }
    // TODO: 출석 가능 시간대 체크
    navigate(`/attendance?token=mock-token-${lecture.id}`)
  }

  const getAttendanceButtonStyle = (status) => {
    switch (status) {
      case '출석':
        return {
          backgroundColor: 'rgb(0, 170, 202)', // YU Sky Blue (로그인 버튼과 동일)
          color: 'white',
        }
      case '지각':
        return {
          backgroundColor: 'rgb(255, 248, 220)', // 연한 노란색
          color: 'rgb(21, 57, 116)', // YU Blue
        }
      case '결석':
        return {
          backgroundColor: 'rgb(255, 248, 220)', // 연한 노란색
          color: 'rgb(21, 57, 116)', // YU Blue
        }
      default: // 미확인
        return {
          backgroundColor: 'rgb(157, 157, 156)', // YU Gray (회색)
          color: 'white',
        }
    }
  }

  const getAttendanceButtonText = (lecture) => {
    if (lecture.attendanceStatus === '출석' && lecture.attendanceTime) {
      return `출석(${lecture.attendanceTime})`
    }
    if (lecture.attendanceStatus === '지각' && lecture.attendanceTime) {
      return `지각(${lecture.attendanceTime})`
    }
    if (lecture.attendanceStatus === '결석') {
      return '결석'
    }
    if (lecture.attendanceStatus === '미확인') {
      return '미확인'
    }
    return ''
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8">
            {/* 페이지 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">오늘의 출결현황</h1>

            {/* 학생 정보 섹션 */}
            <div className="mb-6 bg-slate-30 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {studentInfo.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {studentInfo.studentId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {studentInfo.department}
                  </p>
                </div>
              </div>
            </div>

            {/* 새로고침 버튼 */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-6 py-2 rounded-xl border-2 transition-colors disabled:opacity-50"
                style={{
                  borderColor: 'rgb(0, 170, 202)',
                  color: 'rgb(0, 170, 202)',
                }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm font-medium">재조회</span>
                </div>
              </button>
            </div>

            {/* 오늘의 수업 목록 (스크롤 가능) */}
            <div 
              className="max-h-[500px] overflow-y-scroll border border-gray-200 rounded-xl p-4 space-y-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(157, 157, 156) rgb(243, 244, 246)',
              }}
            >
            {todayLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="bg-white rounded-2xl shadow border border-gray-200 p-5"
              >
                {/* 과목명 */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {lecture.courseName}
                </h2>

                {/* 과목 정보 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4"
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
                    <span>{lecture.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{lecture.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{lecture.location}</span>
                  </div>
                </div>

                {/* 출석 상태 버튼 */}
                <button
                  onClick={() => handleAttendanceClick(lecture)}
                  disabled={lecture.attendanceStatus === '미확인'}
                  className="w-full rounded-2xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:cursor-default"
                  style={getAttendanceButtonStyle(lecture.attendanceStatus)}
                >
                  <span>{getAttendanceButtonText(lecture)}</span>
                </button>
              </div>
            ))}
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </div>
  )
}

export default AttendanceTodayPage
