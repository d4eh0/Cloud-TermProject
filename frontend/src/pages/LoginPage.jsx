import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!studentId || !password) {
      setError('학번과 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      // TODO: 실제 Spring Boot 로그인 API 연동
      await new Promise((resolve) => setTimeout(resolve, 600))

      // 로그인 성공 시 학생 메인으로 이동
      navigate('/attendance/today')
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 콘텐츠 영역 */}
      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-12">
            {/* 로고 영역 */}
            <div className="flex justify-center mb-8 pb-8">
              <img 
                src="/login-logo.png" 
                alt="영남대학교 로고" 
                className="h-12 object-contain"
              />
            </div>

            {/* 제목 영역 */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">캠퍼스 출석 로그인</h2>
              <p className="mt-1 text-sm text-gray-500">
                학교 계정으로 로그인 후 모바일 출석을 진행하세요.
              </p>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  학번
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    '--tw-ring-color': 'rgb(0, 170, 202)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgb(0, 170, 202)'
                    e.target.style.boxShadow = '0 0 0 2px rgb(0, 170, 202)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = ''
                    e.target.style.boxShadow = ''
                  }}
                  placeholder="예) 202212345"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    '--tw-ring-color': 'rgb(0, 170, 202)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgb(0, 170, 202)'
                    e.target.style.boxShadow = '0 0 0 2px rgb(0, 170, 202)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = ''
                    e.target.style.boxShadow = ''
                  }}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

              {/* 메인 액션 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-2xl text-white py-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: isLoading ? 'rgb(157, 157, 156)' : 'rgb(0, 170, 202)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = 'rgb(21, 57, 116)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = 'rgb(0, 170, 202)'
                  }
                }}
              >
                <span className="text-lg"></span>
                <span>{isLoading ? '로그인 중...' : '로그인'}</span>
              </button>
            </form>
          </div>

          {/* 하단 안내 영역 */}
          <div className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
            <p className="font-semibold text-xs text-gray-500">
              Yeungnam University 출석 시스템 (Mock)
            </p>
            <p className="mt-1">
              실제 서비스로 구현된다면, 학교 통합 로그인과 연동되어
              <br />
              출석 기록은 학교 서버에 안전하게 저장됩니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage

