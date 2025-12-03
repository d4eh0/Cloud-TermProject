import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import StudentProfile from '../components/common/StudentProfile'
import RefreshButton from '../components/common/RefreshButton'
import { getCurrentUser } from '../api/auth'
import { getTodayLectures } from '../api/attendance'

function AttendanceTodayPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [studentInfo, setStudentInfo] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [todayLectures, setTodayLectures] = useState([])
  const [isLoadingLectures, setIsLoadingLectures] = useState(true)

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser()
        if (result.success && result.user) {
          setStudentInfo({
            name: result.user.name,
            department: result.user.department,
            studentId: result.user.studentId,
          })
        } else {
          // 인증 실패 시 로그인 페이지로
          navigate('/login')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        navigate('/login')
      } finally {
        setIsLoadingUser(false)
      }
    }
    
    fetchUser()
  }, [navigate])

  // 오늘의 수업 목록 가져오기 (페이지 마운트 시 및 location 변경 시)
  useEffect(() => {
    const fetchLectures = async () => {
      setIsLoadingLectures(true)
      try {
        const lectures = await getTodayLectures()
        setTodayLectures(lectures)
      } catch (error) {
        console.error('Failed to fetch today lectures:', error)
      } finally {
        setIsLoadingLectures(false)
      }
    }

    fetchLectures()
  }, [location]) // location이 변경될 때마다 데이터 다시 가져오기

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const lectures = await getTodayLectures()
      // 상태를 강제로 업데이트하기 위해 새로운 배열로 설정
      setTodayLectures([...lectures])
    } catch (error) {
      console.error('Failed to refresh today lectures:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleAttendanceClick = (lecture) => {
    // 미확인 상태일 때만 출석체크 페이지로 이동
    if (lecture.attendanceStatus !== '미확인') {
      return
    }
    // 출석 가능 시간대 체크는 추후 추가 예정
    navigate(`/attendance?token=mock-token-${lecture.id}`)
  }

  // 출석 상태에 따른 버튼 스타일과 텍스트 반환
  const getAttendanceButtonInfo = (lecture) => {
    const { attendanceStatus, attendanceTime } = lecture
    
    switch (attendanceStatus) {
      case '출석':
        return {
          style: {
            backgroundColor: 'rgb(0, 170, 202)', // YU Sky Blue
          color: 'white',
          },
          text: attendanceTime ? `출석(${attendanceTime})` : '출석',
        }
      case '지각':
        return {
          style: {
            backgroundColor: 'rgb(180, 180, 180)', // 회색 배경
            color: 'white',
          },
          text: attendanceTime ? `지각(${attendanceTime})` : '지각',
        }
      case '결석':
        return {
          style: {
            backgroundColor: 'rgb(180, 180, 180)', // 회색 배경
            color: 'white',
          },
          text: '결석',
        }
      default: // 미확인
        return {
          style: {
            backgroundColor: 'rgb(210, 210, 210)', // 연한 회색 배경 (지각/결석보다 연함)
          color: 'white',
          },
          text: '미확인',
    }
  }
  }

  // 로딩 중이면 로딩 표시
  if (isLoadingUser || isLoadingLectures) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  // 사용자 정보가 없으면 아무것도 표시하지 않음 (이미 navigate됨)
  if (!studentInfo) {
    return null
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
            <StudentProfile studentInfo={studentInfo} />

            {/* 재조회 버튼 */}
            <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} />

            {/* 오늘의 수업 목록 (스크롤 가능) */}
            <div 
              className="max-h-[500px] overflow-y-scroll border border-gray-200 rounded-xl p-4 space-y-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(157, 157, 156) rgb(243, 244, 246)',
              }}
            >
            {todayLectures.length === 0 ? (
              <div className="w-full py-8 text-center text-sm text-gray-500">
                오늘은 출석 대상 수업이 없습니다.
              </div>
            ) : (
              todayLectures.map((lecture) => {
                const { style, text } = getAttendanceButtonInfo(lecture)
                
                return (
                <div
                  key={lecture.id}
                    className="bg-white rounded-2xl shadow border border-gray-200 p-5 relative"
                >
                  {/* 과목명 및 상세보기 링크 */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                  {lecture.courseName}
                </h2>
                    <button
                      onClick={() => navigate(`/attendance/history/detail/${lecture.courseId || lecture.id}`)}
                      className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                    >
                      출결현황
                    </button>
                  </div>

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
                    disabled={lecture.attendanceStatus !== '미확인'}
                    className="w-full rounded-2xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:cursor-default disabled:opacity-75"
                      style={style}
                  >
                      <span>{text}</span>
                  </button>
                </div>
                )
              })
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

export default AttendanceTodayPage

