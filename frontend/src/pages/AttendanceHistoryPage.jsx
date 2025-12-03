import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'

function AttendanceHistoryPage() {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock 학생 정보
  const studentInfo = {
    name: '박대형',
    department: '컴퓨터공학과',
    studentId: '22213482',
  }

  // Mock 내가 듣는 과목 목록
  const myCourses = [
    {
      id: 1,
      courseName: '데이터베이스',
      courseCode: 1101,
    },
    {
      id: 2,
      courseName: '운영체제',
      courseCode: 1102,
    },
    {
      id: 3,
      courseName: '컴퓨터구조',
      courseCode: 1103,
    },
    {
      id: 4,
      courseName: '클라우드컴퓨팅',
      courseCode: 1104,
    },
    {
      id: 5,
      courseName: '소프트웨어공학',
      courseCode: 1105,
    },
    {
      id: 6,
      courseName: '웹프로그래밍',
      courseCode: 1106,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // TODO: 실제 API 호출로 출석 현황 갱신
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsRefreshing(false)
  }

  const handleCourseClick = (course) => {
    // TODO: 과목별 출석 상세 페이지로 이동
    navigate(`/attendance/history/detail/${course.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8">
            {/* 페이지 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">과목별 출결현황</h1>

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

            {/* 수강항목 리스트 (스크롤 가능) */}
            <div 
              className="max-h-[500px] overflow-y-scroll border border-gray-200 rounded-xl p-4 space-y-3"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(157, 157, 156) rgb(243, 244, 246)',
              }}
            >
            {myCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 text-left hover:shadow-md transition-shadow"
              >
                {/* 과목명 및 과목코드 */}
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900">
                    {course.courseName}
                  </h2>
                  <span className="text-xs text-gray-500">
                    ({course.courseCode})
                  </span>
                </div>
              </button>
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

export default AttendanceHistoryPage
