import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import StudentProfile from '../components/common/StudentProfile'

function AttendancePage() {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [availableLecture, setAvailableLecture] = useState(null)

  // Mock 학생 정보
  const studentInfo = {
    name: '박대형',
    department: '컴퓨터공학과',
    studentId: '22213482',
  }

  // Mock 오늘의 수업 목록 (전체)
  // 현재 시간 기준으로 출석 가능한 과목이 표시되도록 시간 설정
  const getTodayLectures = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinutes

    // 현재 시간 기준으로 출석 가능한 시간대 생성
    // 예: 현재가 11시 30분이면 11:00 ~ 12:15 수업이 출석 가능
    const startHour = currentHour
    const startMin = Math.max(0, currentMinutes - 5) // 5분 전부터
    const endHour = startHour + 1
    const endMin = Math.min(59, currentMinutes + 30) // 1시간 30분 후까지

    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

    return [
      {
        id: 1,
        courseName: '데이터베이스',
        date: '2025-12-02(화)',
        time: `${startTime} ~ ${endTime}`,
        location: 'IT관(E21-114)',
      },
      {
        id: 2,
        courseName: '운영체제',
        date: '2025-12-02(화)',
        time: '13:00 ~ 14:15',
        location: 'IT관(E21-114)',
      },
      {
        id: 3,
        courseName: '컴퓨터구조',
        date: '2025-12-02(화)',
        time: '13:00 ~ 14:15',
        location: 'IT관(E21-114)',
      },
      {
        id: 4,
        courseName: '클라우드컴퓨팅',
        date: '2025-12-02(화)',
        time: '15:00 ~ 16:15',
        location: 'IT관(E21-114)',
      },
    ]
  }

  const allTodayLectures = getTodayLectures()

  // 시간 문자열을 분 단위로 변환 (예: "11:00" -> 660)
  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  // 현재 시간대에 출석 가능한 과목 찾기
  const findAvailableLecture = () => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    // 출석 가능 시간: 수업 시작 10분 전 ~ 수업 종료 후 10분
    const availableLecture = allTodayLectures.find((lecture) => {
      const [startTime, endTime] = lecture.time.split(' ~ ')
      const startMinutes = parseTimeToMinutes(startTime)
      const endMinutes = parseTimeToMinutes(endTime)

      // 출석 가능 시간 범위
      const checkInStart = startMinutes - 10
      const checkInEnd = endMinutes + 10

      return currentMinutes >= checkInStart && currentMinutes <= checkInEnd
    })

    setAvailableLecture(availableLecture || null)
  }

  // 컴포넌트 마운트 시 및 재조회 시 출석 가능한 과목 찾기
  useEffect(() => {
    findAvailableLecture()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // TODO: 실제 API 호출로 출석 현황 갱신
    await new Promise((resolve) => setTimeout(resolve, 800))
    findAvailableLecture() // 재조회 시 다시 찾기
    setIsRefreshing(false)
  }

  const handleCheckIn = async (lecture) => {
    // TODO: 출석 체크 로직 (로딩 모달 띄우고 성공 시 /attendance/today로 이동)
    console.log('출석 체크:', lecture)
    navigate(`/attendance?token=mock-token-${lecture.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8">
            {/* 페이지 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">출석체크</h1>

            {/* 학생 정보 섹션 */}
            <StudentProfile studentInfo={studentInfo} />

            {/* 재조회 버튼 */}
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

            {/* 출석 가능한 과목 표시 영역 */}
            <div className="border border-gray-200 rounded-xl p-6">
              {availableLecture ? (
                <div className="bg-white rounded-2xl p-5">
                  {/* 과목명 */}
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {availableLecture.courseName}
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
                      <span>{availableLecture.date}</span>
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
                      <span>{availableLecture.time}</span>
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
                      <span>{availableLecture.location}</span>
                    </div>
                  </div>

                  {/* 출석체크 버튼 */}
                  <button
                    onClick={() => handleCheckIn(availableLecture)}
                    className="w-full rounded-2xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                    style={{
                      backgroundColor: 'rgb(0, 170, 202)', // YU Sky Blue
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgb(21, 57, 116)' // YU Blue
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgb(0, 170, 202)' // YU Sky Blue
                    }}
                  >
                    <span>출석체크</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-base">
                    현재 출석 가능한 과목없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </div>
  )
}

export default AttendancePage
