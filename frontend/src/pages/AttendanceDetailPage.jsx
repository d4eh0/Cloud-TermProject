import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'

function AttendanceDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock 과목 정보 (id 기반으로 결정)
  const courseMap = {
    1: { courseName: '데이터베이스', courseCode: 1101, isWeekly: true }, // 주당 1번
    2: { courseName: '운영체제', courseCode: 1102, isWeekly: false }, // 주당 2번
    3: { courseName: '컴퓨터구조', courseCode: 1103, isWeekly: false }, // 주당 2번
    4: { courseName: '클라우드컴퓨팅', courseCode: 1104, isWeekly: true }, // 주당 1번
    5: { courseName: '소프트웨어공학', courseCode: 1105, isWeekly: false }, // 주당 2번
    6: { courseName: '웹프로그래밍', courseCode: 1106, isWeekly: false }, // 주당 2번
  }

  const courseInfo = courseMap[id] || courseMap[1]
  const isWeekly = courseInfo.isWeekly

  // Mock 출석 기록 생성
  const generateAttendanceRecords = () => {
    if (isWeekly) {
      // 주당 1번 (15주차)
      return [
        { session: 1, date: '09-03', status: '출석' },
        { session: 2, date: '09-10', status: '출석' },
        { session: 3, date: '09-17', status: '출석' },
        { session: 4, date: '09-24', status: '출석' },
        { session: 5, date: '10-01', status: '출석' },
        { session: 6, date: '10-15', status: '출석' },
        { session: 7, date: '10-22', status: '중간고사' },
        { session: 8, date: '10-29', status: '결석' },
        { session: 9, date: '11-05', status: '출석' },
        { session: 10, date: '11-12', status: '출석' },
        { session: 11, date: '11-19', status: '출석' },
        { session: 12, date: '11-26', status: '출석' },
        { session: 13, date: '12-03', status: null },
        { session: 14, date: '12-11', status: null },
        { session: 15, date: '12-17', status: '기말고사' },
      ]
    } else {
      // 주당 2번 (30주차)
      return [
        { session: 1, date: '09-01', status: '출석' },
        { session: 2, date: '09-04', status: '출석' },
        { session: 3, date: '09-08', status: '출석' },
        { session: 4, date: '09-11', status: '출석' },
        { session: 5, date: '09-15', status: '출석' },
        { session: 6, date: '09-18', status: '출석' },
        { session: 7, date: '09-22', status: '출석' },
        { session: 8, date: '09-25', status: '출석' },
        { session: 9, date: '09-29', status: '출석' },
        { session: 10, date: '10-02', status: '출석' },
        { session: 11, date: '10-13', status: '출석' },
        { session: 12, date: '10-16', status: '출석' },
        { session: 13, date: '10-20', status: '중간고사' },
        { session: 14, date: '10-23', status: '중간고사' },
        { session: 15, date: '10-27', status: '출석' },
        { session: 16, date: '10-30', status: '출석' },
        { session: 17, date: '11-03', status: '출석' },
        { session: 18, date: '11-06', status: '출석' },
        { session: 19, date: '11-10', status: '출석' },
        { session: 20, date: '11-13', status: '출석' },
        { session: 21, date: '11-17', status: '출석' },
        { session: 22, date: '11-20', status: '출석' },
        { session: 23, date: '11-24', status: '출석' },
        { session: 24, date: '11-27', status: '결석' },
        { session: 25, date: '12-01', status: '출석' },
        { session: 26, date: '12-04', status: null },
        { session: 27, date: '12-09', status: null },
        { session: 28, date: '12-12', status: null },
        { session: 29, date: '12-15', status: '기말고사' },
        { session: 30, date: '12-18', status: '기말고사' },
      ]
    }
  }

  const attendanceRecords = generateAttendanceRecords()

  // 세션 번호를 주차/차시로 변환
  const getSessionLabel = (session) => {
    if (isWeekly) {
      // 주당 1번: session 1 = 1-1차시, session 2 = 2-1차시
      return `${session}-1차시`
    } else {
      // 주당 2번: session 1 = 1-1차시, session 2 = 1-2차시, session 3 = 2-1차시
      const week = Math.ceil(session / 2)
      const sessionInWeek = ((session - 1) % 2) + 1
      return `${week}-${sessionInWeek}차시`
    }
  }

  // 5개씩 그룹화
  const groupedRecords = []
  for (let i = 0; i < attendanceRecords.length; i += 5) {
    groupedRecords.push(attendanceRecords.slice(i, i + 5))
  }

  const getStatusStyle = (status) => {
    if (!status) return { color: 'rgb(107, 114, 128)' }
    
    switch (status) {
      case '출석':
        return {
          color: 'rgb(56, 189, 248)', // 더 밝은 Sky Blue
        }
      case '지각':
        return {
          color: 'rgb(157, 157, 156)', // YU Gray (회색)
        }
      case '결석':
        return {
          color: 'rgb(157, 157, 156)', // YU Gray (회색)
        }
      case '중간고사':
      case '기말고사':
        return {
          color: 'rgb(0, 170, 202)', // YU Sky Blue (현재 출석색)
        }
      default:
        return {
          color: 'rgb(157, 157, 156)', // YU Gray
        }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8">
            {/* 헤더 (뒤로가기 + 제목) */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate('/attendance/history')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">과목별 출결현황</h1>
            </div>

            {/* 과목명 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {courseInfo.courseName}({courseInfo.courseCode})
              </h2>
            </div>

            {/* 출석 테이블 */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {groupedRecords.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {/* 세션 번호 헤더 */}
                    <div className={`grid grid-cols-5 border border-gray-300 overflow-hidden ${rowIndex === 0 ? 'rounded-t-lg' : 'border-t-0'}`}>
                      {row.map((record) => (
                        <div
                          key={record.session}
                          className="text-center text-xs font-semibold text-gray-600 py-2 border-r border-gray-300 last:border-r-0 bg-gray-50"
                        >
                          {getSessionLabel(record.session)}
                        </div>
                      ))}
                      {/* 빈 공간 채우기 */}
                      {row.length < 5 && (
                        Array.from({ length: 5 - row.length }).map((_, i) => (
                          <div key={`empty-header-${i}`} className="border-r border-gray-300 last:border-r-0 bg-gray-50" />
                        ))
                      )}
                    </div>

                    {/* 날짜 및 출석 상태 */}
                    <div className={`grid grid-cols-5 border border-gray-300 border-t-0 overflow-hidden ${rowIndex === groupedRecords.length - 1 ? 'rounded-b-lg' : ''}`}>
                      {row.map((record) => (
                        <div
                          key={record.session}
                          className="flex flex-col items-center border-r border-gray-300 last:border-r-0"
                        >
                          <div className="text-xs text-gray-700 font-medium py-1.5 border-b border-gray-200 w-full text-center">
                            {record.date}
                          </div>
                            {record.status && (
                              <div
                                className="w-full py-1.5 px-1 text-xs font-semibold text-center"
                                style={getStatusStyle(record.status)}
                              >
                                {record.status}
                              </div>
                            )}
                          {!record.status && (
                            <div className="w-full py-1.5 px-1" />
                          )}
                        </div>
                      ))}
                      {/* 빈 공간 채우기 */}
                      {row.length < 5 && (
                        Array.from({ length: 5 - row.length }).map((_, i) => (
                          <div key={`empty-cell-${i}`} className="border-r border-gray-300 last:border-r-0" />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 바 */}
      <BottomNavigation />
    </div>
  )
}

export default AttendanceDetailPage
