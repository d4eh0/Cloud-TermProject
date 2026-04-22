import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import StudentProfile from '../components/common/StudentProfile'
import RefreshButton from '../components/common/RefreshButton'
import PolicyModal from '../components/attendance/PolicyModal'
import { getCurrentUser } from '../api/auth'
import { getSessionByToken, getAvailableSession, requestAttendance } from '../api/attendance'

function AttendancePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [availableLecture, setAvailableLecture] = useState(null)
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [isTestModeModalOpen, setIsTestModeModalOpen] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [loadingDots, setLoadingDots] = useState('.')
  const [studentInfo, setStudentInfo] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const token = searchParams.get('token')

  const toSessionState = (data) => data ? {
    id: data.id,
    courseName: data.courseName,
    date: data.date,
    time: data.time,
    location: data.location,
  } : null

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoadingSession(true)
      try {
        const sessionData = token
          ? await getSessionByToken(token)
          : await getAvailableSession()
        setAvailableLecture(toSessionState(sessionData))
      } catch (error) {
        console.error('Failed to fetch session:', error)
        setAvailableLecture(null)
      } finally {
        setIsLoadingSession(false)
      }
    }

    fetchSession()
  }, [token])

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

  useEffect(() => {
    if (!isCheckingIn) return

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === '.') return '..'
        if (prev === '..') return '...'
        return '.'
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isCheckingIn])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const [sessionData] = await Promise.all([
        token ? getSessionByToken(token) : getAvailableSession(),
        new Promise(resolve => setTimeout(resolve, 300))
      ])
      setAvailableLecture(toSessionState(sessionData))
    } catch (error) {
      console.error('Failed to refresh session:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCheckIn = async (lecture) => {
    setIsCheckingIn(true)
    setLoadingDots('.')

    try {
      let latitude, longitude

      if (isTestMode) {
        // 테스트 모드: GPS 검증 우회, IT관 좌표 그대로 사용
        latitude = 35.830620
        longitude = 128.754680
      } else {
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('GPS를 지원하지 않는 브라우저입니다.'))
            return
          }

          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          )
        })

        latitude = position.coords.latitude
        longitude = position.coords.longitude

        const lectureLocation = { lat: 35.830620, lng: 128.754680 }
        const distance = calculateDistance(latitude, longitude, lectureLocation.lat, lectureLocation.lng)
        const maxDistance = 30 // 30m 이내

        if (distance > maxDistance) {
          setIsCheckingIn(false)
          alert(`수업 장소에서 너무 멀리 떨어져 있습니다. (${Math.round(distance)}m)\n강의실 반경 30m 이내에서만 출석이 가능합니다.`)
          return
        }
      }

      const attendanceData = {
        lectureId: lecture.id,
        latitude,
        longitude,
        deviceId: navigator.userAgent,
      }

      const result = await requestAttendance(attendanceData)

      if (!result.success) {
        setIsCheckingIn(false)
        alert(result.message || '출석 체크에 실패했습니다.')
        return
      }

      setIsCheckingIn(false)
      alert('출석 체크가 완료되었습니다.')
      navigate('/attendance/today')
    } catch (error) {
      setIsCheckingIn(false)
      console.error('출석 체크 실패:', error)

      if (error.code === 1) {
        alert('GPS 권한이 거부되었습니다. 출석을 진행하려면 GPS 권한을 허용해주세요.')
      } else if (error.code === 2) {
        alert('위치 정보를 가져올 수 없습니다. GPS가 켜져있는지 확인해주세요.')
      } else if (error.code === 3) {
        alert('위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.')
      } else {
        alert('출석 체크 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (!studentInfo) return null

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="flex-1 flex justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-md px-6 py-8 relative">
            {/* 페이지 제목 및 ? 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">출석체크</h1>
              <button
                onClick={() => setIsPolicyModalOpen(true)}
                className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors hover:bg-gray-50"
                style={{ borderColor: 'rgb(157, 157, 156)' }}
              >
                <span className="text-gray-600 font-semibold text-xs">?</span>
              </button>
            </div>

            {/* 학생 정보 섹션 */}
            <StudentProfile studentInfo={studentInfo} />

            {/* 재조회 버튼 */}
            <RefreshButton onClick={handleRefresh} isRefreshing={isRefreshing} disabled={false} />

            {/* 테스트 모드 토글 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">테스트 모드</span>
                <button
                  onClick={() => setIsTestModeModalOpen(true)}
                  className="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'rgb(157, 157, 156)' }}
                >
                  <span className="text-gray-500 font-semibold text-[10px]">?</span>
                </button>
              </div>
              <button
                onClick={() => setIsTestMode((prev) => !prev)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                style={{
                  backgroundColor: isTestMode ? 'rgb(234, 88, 12)' : 'rgb(209, 213, 219)',
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: isTestMode ? 'translateX(1.375rem)' : 'translateX(0.25rem)',
                  }}
                />
              </button>
            </div>

            {/* 테스트 모드 ON 상태 표시 */}
            {isTestMode && (
              <p className="mb-2 text-xs text-red-500 px-1">
                테스트 모드 활성화 — GPS 검증이 우회됩니다
              </p>
            )}

            {/* 출석 가능한 과목 표시 영역 */}
            <div className="border border-gray-200 rounded-xl p-6">
              {availableLecture ? (
                <div className="bg-white rounded-2xl p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {availableLecture.courseName}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{availableLecture.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{availableLecture.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{availableLecture.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckIn(availableLecture)}
                    className="w-full rounded-2xl py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                    style={{ backgroundColor: 'rgb(0, 170, 202)', color: 'white' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(21, 57, 116)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgb(0, 170, 202)' }}
                  >
                    <span>출석체크</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-base">현재 출석 가능한 과목없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* 출석 정책 안내 모달 */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      {/* 테스트 모드 안내 모달 */}
      {isTestModeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={() => setIsTestModeModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">테스트 모드 안내</h3>
              <button
                onClick={() => setIsTestModeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              실제 서비스에서는 강의실 반경 <strong>30m 이내</strong>에서만 출석이 가능합니다.
              <br /><br />
              테스트 모드를 활성화하면 GPS 위치 검증이 우회되어
              어느 위치에서든 출석 체크가 가능합니다.
              <br /><br />
              <span className="text-orange-600 font-medium">※ 실제 배포 환경에서는 비활성화됩니다.</span>
            </p>
            <button
              onClick={() => setIsTestModeModalOpen(false)}
              className="mt-5 w-full rounded-2xl py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: 'rgb(0, 170, 202)' }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 출석 중 로딩 모달 */}
      {isCheckingIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg font-semibold text-gray-900">출석 중입니다{loadingDots}</p>
              <p className="text-sm text-gray-600 text-center">잠시만 기다려주세요...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendancePage
