/**
 * 출석 관련 API 함수
 */
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 오늘의 수업 목록 조회
 * @returns {Promise<Array>}
 */
export const getTodayLectures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/today`, {
      method: 'GET',
      credentials: 'include', // 쿠키 전송
    })

    const data = await response.json()

    if (!data.success) {
      console.error('Get today lectures failed:', data.message)
      return []
    }

    return data.data || []
  } catch (error) {
    console.error('Get today lectures error:', error)
    return []
  }
}

/**
 * 출석 기록 조회 (과목별)
 * @returns {Promise<Array>}
 */
export const getAttendanceHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/history`, {
      method: 'GET',
      credentials: 'include', // 쿠키 전송
    })

    const data = await response.json()

    if (!data.success) {
      console.error('Get attendance history failed:', data.message)
      return []
    }

    // data: CourseDto[] 형태
    return data.data || []
  } catch (error) {
    console.error('Get attendance history error:', error)
    return []
  }
}

/**
 * 출석 상세 정보 조회
 * @param {number|string} courseId - 과목 ID
 * @returns {Promise<object|null>}
 */
export const getAttendanceDetail = async (courseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/detail/${courseId}`, {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.json()

    if (!data.success) {
      console.error('Get attendance detail failed:', data.message)
      return null
    }

    // data: AttendanceDetailDto 형태
    return data.data || null
  } catch (error) {
    console.error('Get attendance detail error:', error)
    return null
  }
}

/**
 * 현재 출석 가능한 세션 자동 조회 (토큰 없이 접속 시 사용)
 * @returns {Promise<object|null>}
 */
export const getAvailableSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/available`, {
      method: 'GET',
      credentials: 'include',
    })
    const data = await response.json()
    if (!data.success) return null
    return data.data || null
  } catch (error) {
    console.error('Get available session error:', error)
    return null
  }
}

/**
 * 토큰으로 출석 세션 정보 조회
 * @param {string} token - 출석 토큰
 * @returns {Promise<object|null>}
 */
export const getSessionByToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/session?token=${token}`, {
      method: 'GET',
      credentials: 'include', // 쿠키 전송
    })

    const data = await response.json()

    if (!data.success) {
      console.error('Get session by token failed:', data.message)
      return null
    }

    // 백엔드 응답 형식: { success: true, data: AttendanceSessionDto }
    return data.data || null
  } catch (error) {
    console.error('Get session by token error:', error)
    return null
  }
}

/**
 * 출석 체크 요청
 * @param {object} attendanceData
 * @param {number} attendanceData.lectureId
 * @param {number} attendanceData.latitude
 * @param {number} attendanceData.longitude
 * @param {string} attendanceData.deviceId
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const requestAttendance = async (attendanceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 전송
      body: JSON.stringify(attendanceData),
    })

    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        message: data.message || '출석 체크에 실패했습니다.',
      }
    }

    // 백엔드 응답 형식: { success: true, data: AttendanceCheckResponse }
    return {
      success: true,
      data: data.data, // AttendanceCheckResponse 객체
    }
  } catch (error) {
    console.error('Request attendance error:', error)
    return {
      success: false,
      message: '출석 체크에 실패했습니다. 다시 시도해주세요.',
    }
  }
}

