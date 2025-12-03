/**
 * 인증 관련 API 함수
 */

const API_BASE_URL = 'http://localhost:8080/api'

/**
 * 로그인
 * @param {string} studentId - 학번
 * @param {string} password - 비밀번호
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export const login = async (studentId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 전송을 위해 필수
      body: JSON.stringify({ studentId, password }),
    })
    
    const data = await response.json()
    return data
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
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // 쿠키 전송을 위해 필수
    })
    return await response.json()
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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // 쿠키 전송을 위해 필수
    })
    return await response.json()
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
      user: null,
    }
  }
}

