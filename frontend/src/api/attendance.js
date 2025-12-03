/**
 * 출석 관련 API 함수
 */
 
const API_BASE_URL = 'http://localhost:8080/api'

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
 * 토큰으로 출석 세션 정보 조회
 * @param {string} token - 출석 토큰
 * @returns {Promise<object>}
 */
export const getSessionByToken = async (token) => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/attendance/session?token=${token}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 500))
    const lectureId = token.split('-').pop()
    return {
      id: lectureId,
      courseName: '데이터베이스',
      date: '2025-12-02(화)',
      time: '11:00 ~ 12:15',
      location: 'IT관(E21-114)',
      remainingTime: 15, // 남은 출석 가능 시간 (분)
    }
  } catch (error) {
    console.error('Get session by token error:', error)
    return null
  }
}

/**
 * 출석 체크 요청
 * @param {object} attendanceData - 출석 데이터
 * @param {number} attendanceData.lectureId - 수업 ID
 * @param {number} attendanceData.latitude - 위도
 * @param {number} attendanceData.longitude - 경도
 * @param {string} attendanceData.deviceId - 기기 ID
 * @param {string} attendanceData.captchaToken - CAPTCHA 토큰
 * @returns {Promise<{success: boolean, attendance?: object, message?: string}>}
 */
export const requestAttendance = async (attendanceData) => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/attendance/check`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    //   body: JSON.stringify(attendanceData),
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      success: true,
      attendance: {
        id: Date.now(),
        lectureId: attendanceData.lectureId,
        status: '출석',
        attendanceTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        location: {
          latitude: attendanceData.latitude,
          longitude: attendanceData.longitude,
        },
      },
    }
  } catch (error) {
    console.error('Request attendance error:', error)
    return {
      success: false,
      message: '출석 체크에 실패했습니다. 다시 시도해주세요.',
    }
  }
}

