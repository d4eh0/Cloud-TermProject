import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import { getAttendanceDetail } from '../api/attendance'

function AttendanceDetailPage() {
  const navigate = useNavigate()
  const { id: courseId } = useParams()

  const [detail, setDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await getAttendanceDetail(courseId)
        if (!result) {
          setIsError(true)
        } else {
          setDetail(result)
        }
      } catch (e) {
        console.error('Failed to fetch attendance detail:', e)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [courseId])

  const recordsWithSession = useMemo(() => {
    // 백엔드에서 보내준 records를 그대로 사용 (이미 주차/차시 라벨 포함)
    const records = detail?.records || []
    return records.map((record, index) => ({
      session: index + 1,
      sessionLabel: record.sessionLabel || `${index + 1}`,
      date: record.date || '',
      status: record.status || null,
    }))
  }, [detail])

  // 세션 라벨 표시 (백엔드에서 보내준 sessionLabel 사용)
  const getSessionLabel = (record) => {
    return record.sessionLabel || `${record.session}`
  }

  // 5개씩 그룹화
  const groupedRecords = useMemo(() => {
    const result = []
    for (let i = 0; i < recordsWithSession.length; i += 5) {
      result.push(recordsWithSession.slice(i, i + 5))
    }
    return result
  }, [recordsWithSession])

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

            {/* 로딩/에러/과목명 */}
            {isLoading && (
              <div className="mb-6 text-sm text-gray-500">출석 정보를 불러오는 중입니다...</div>
            )}
            {!isLoading && isError && (
              <div className="mb-6 text-sm text-red-500">
                출석 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
              </div>
            )}
            {!isLoading && !isError && detail && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {detail.courseName}({detail.courseCode})
                </h2>
              </div>
            )}

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
                          {getSessionLabel(record)}
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
