/**
 * 인증 관련 API 함수
 * TODO: 실제 Spring Boot 백엔드 API 연동
 */

const API_BASE_URL = '/api' // TODO: 실제 API 베이스 URL로 변경

/**
 * 로그인
 * @param {string} studentId - 학번
 * @param {string} password - 비밀번호
 * @returns {Promise<{success: boolean, user?: object, token?: string, message?: string}>}
 */
export const login = async (studentId, password) => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ studentId, password }),
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 600))
    
    if (studentId && password) {
      return {
        success: true,
        user: {
          id: 1,
          studentId: studentId,
          name: '박대형',
          department: '컴퓨터공학과',
        },
        token: 'mock-token-' + Date.now(),
      }
    } else {
      return {
        success: false,
        message: '학번과 비밀번호를 입력해주세요.',
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: '로그인에 실패했습니다. 다시 시도해주세요.',
    }
  }
}

/**
 * 로그아웃
 * @returns {Promise<{success: boolean}>}
 */
export const logout = async () => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false }
  }
}

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns {Promise<{success: boolean, user?: object}>}
 */
export const getCurrentUser = async () => {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/auth/me`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //   },
    // })
    // return await response.json()

    // Mock 구현
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      user: {
        id: 1,
        studentId: '22213482',
        name: '박대형',
        department: '컴퓨터공학과',
      },
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
      user: null,
    }
  }
}

