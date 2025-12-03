/**
 * 날짜/시간/거리 포맷 유틸리티 함수
 */

/**
 * 날짜를 "YYYY-MM-DD(요일)" 형식으로 포맷
 * @param {Date|string} date - 날짜 객체 또는 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열 (예: "2025-12-02(화)")
 */
export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[d.getDay()]
  
  return `${year}-${month}-${day}(${weekday})`
}

/**
 * 날짜를 "MM-DD" 형식으로 포맷
 * @param {Date|string} date - 날짜 객체 또는 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열 (예: "12-02")
 */
export const formatDateShort = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${month}-${day}`
}

/**
 * 시간을 "HH:MM" 형식으로 포맷
 * @param {Date|string} time - 시간 객체 또는 시간 문자열
 * @returns {string} 포맷된 시간 문자열 (예: "14:56")
 */
export const formatTime = (time) => {
  if (typeof time === 'string' && time.includes(':')) {
    // 이미 "HH:MM" 형식인 경우 그대로 반환
    return time.split(':').slice(0, 2).join(':')
  }
  
  const d = time instanceof Date ? time : new Date(time)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}`
}

/**
 * 시간 범위를 "HH:MM ~ HH:MM" 형식으로 포맷
 * @param {Date|string} startTime - 시작 시간
 * @param {Date|string} endTime - 종료 시간
 * @returns {string} 포맷된 시간 범위 문자열 (예: "11:00 ~ 12:15")
 */
export const formatTimeRange = (startTime, endTime) => {
  return `${formatTime(startTime)} ~ ${formatTime(endTime)}`
}

/**
 * 시간 문자열을 분 단위로 변환
 * @param {string} timeStr - "HH:MM" 형식의 시간 문자열
 * @returns {number} 분 단위 시간 (예: "11:00" -> 660)
 */
export const parseTimeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * 분 단위 시간을 "HH:MM" 형식으로 변환
 * @param {number} minutes - 분 단위 시간
 * @returns {string} "HH:MM" 형식의 시간 문자열
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * 거리를 미터 단위로 포맷
 * @param {number} meters - 미터 단위 거리
 * @returns {string} 포맷된 거리 문자열 (예: "150m", "1.5km")
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  } else {
    const km = (meters / 1000).toFixed(1)
    return `${km}km`
  }
}

/**
 * 두 좌표 간 거리 계산 (Haversine formula)
 * @param {number} lat1 - 첫 번째 위도
 * @param {number} lon1 - 첫 번째 경도
 * @param {number} lat2 - 두 번째 위도
 * @param {number} lon2 - 두 번째 경도
 * @returns {number} 거리 (미터 단위)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000 // 지구 반지름 (미터)
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

/**
 * 현재 시간이 주어진 시간 범위 내에 있는지 확인
 * @param {string} startTime - 시작 시간 "HH:MM"
 * @param {string} endTime - 종료 시간 "HH:MM"
 * @param {number} bufferMinutes - 버퍼 시간 (분) - 기본값 10분
 * @returns {boolean} 시간 범위 내에 있으면 true
 */
export const isWithinTimeRange = (startTime, endTime, bufferMinutes = 10) => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  
  const checkInStart = startMinutes - bufferMinutes
  const checkInEnd = endMinutes + bufferMinutes
  
  return currentMinutes >= checkInStart && currentMinutes <= checkInEnd
}

