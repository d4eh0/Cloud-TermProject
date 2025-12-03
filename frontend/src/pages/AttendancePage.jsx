import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import StudentProfile from '../components/common/StudentProfile'

function AttendancePage() {
  const navigate = useNavigate()

  // Mock 학생 정보
  const studentInfo = {
    name: '박대형',
    department: '컴퓨터공학과',
    studentId: '22213482',
  }

  // Mock 오늘의 수업 목록 (출석 가능한 수업만)
  const todayLectures = [
    {
      id: 1,
      courseName: '데이터베이스',
      date: '2025-12-02(화)',
      time: '11:00 ~ 12:15',
      location: 'IT관(E21-114)',
      canCheckIn: true, // 출석 가능 여부
    },
    {
      id: 2,
      courseName: '운영체제',
      date: '2025-12-02(화)',
      time: '13:00 ~ 14:15',
      location: 'IT관(E21-114)',
      canCheckIn: true,
    },
    {
      id: 3,
      courseName: '컴퓨터구조',
      date: '2025-12-02(화)',
      time: '13:00 ~ 14:15',
      location: 'IT관(E21-114)',
      canCheckIn: false, // 출석 불가능 (시간 지남 등)
    },
    {
      id: 4,
      courseName: '클라우드컴퓨팅',
      date: '2025-12-02(화)',
      time: '15:00 ~ 16:15',
      location: 'IT관(E21-114)',
      canCheckIn: true,
    },
  ]

  const handleCheckIn = async (lecture) => {
    // TODO: 출석 체크 로직 (로딩 모달 띄우고 성공 시 /attendance/today로 이동)
    // 일단은 버튼만 구성
    console.log('출석 체크:', lecture)
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

                {/* 출석체크 버튼 */}
                <button
                  onClick={() => handleCheckIn(lecture)}
                  disabled={!lecture.canCheckIn}
                  className="w-full rounded-2xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: lecture.canCheckIn ? 'rgb(0, 170, 202)' : 'rgb(157, 157, 156)',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    if (lecture.canCheckIn) {
                      e.target.style.backgroundColor = 'rgb(21, 57, 116)' // YU Blue
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (lecture.canCheckIn) {
                      e.target.style.backgroundColor = 'rgb(0, 170, 202)' // YU Sky Blue
                    }
                  }}
                >
                  <span>{lecture.canCheckIn ? '출석체크' : '출석 불가'}</span>
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

export default AttendancePage
