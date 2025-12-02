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
      navigate('/student/home')
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 상단 네이비 헤더 */}
      <header className="h-14 bg-blue-900 text-white flex items-center justify-center px-4 shadow">
        <h1 className="text-sm font-semibold tracking-wide">스마트 출석 시스템</h1>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-md">
          {/* 메인 카드 */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8">
            {/* 프로필 아바타 영역 */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <div className="w-16 h-16 border border-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-slate-400 text-3xl">👤</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">캠퍼스 출석 로그인</h2>
              <p className="mt-1 text-sm text-gray-500">
                학교 계정으로 로그인 후 모바일 출석을 진행하세요.
              </p>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  학번 / 아이디
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

              {/* 메인 액션 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-2xl bg-blue-800 hover:bg-blue-900 text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="text-lg">🔐</span>
                <span>{isLoading ? '로그인 중...' : '학교 계정으로 로그인'}</span>
              </button>
            </form>
          </div>

          {/* 하단 안내 영역 */}
          <div className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
            <p className="font-semibold text-xs text-gray-500">
              Yeungnam University 출석 시스템 (Mock)
            </p>
            <p className="mt-1">
              실제 서비스에서는 학교 통합 로그인과 연동되며,
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

