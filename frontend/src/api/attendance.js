/**
 * 출석 관련 API 함수
 * TODO: 실제 Spring Boot 백엔드 API 연동
 */

const API_BASE_URL = '/api' // TODO: 실제 API 베이스 URL로 변경

/**
 * 오늘의 수업 목록 조회
 * @returns {Promise<Array>}
 */
export const getTodayLectures = async () => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/attendance/today`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
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
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/attendance/history`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
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
  } catch (error) {
    console.error('Get attendance history error:', error)
    return []
  }
}

/**
 * 출석 상세 정보 조회
 * @param {number|string} id - 출석 기록 ID
 * @returns {Promise<object>}
 */
export const getAttendanceDetail = async (id) => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: id,
      courseName: '데이터베이스',
      courseCode: 1101,
      // ... 기타 상세 정보
    }
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

