import { useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import BottomNavigation from '../components/common/BottomNavigation'

const D_NAVY  = '#1e3a5f'
const D_SLATE = '#334155'
const D_LIGHT = '#e2e8f0'

const LEVEL_COLORS = { normal: D_NAVY, warn: 'rgb(234,88,12)', danger: 'rgb(239,68,68)' }

const USER_STEPS = [10, 100, 500, 1000, 5000]

const TOOLTIPS = {
  p50:  '중간값 응답시간. 전체 요청의 50%가 이 시간 이하로 응답.\n이상적: 200ms↓ / 주의: 500ms↑ / 위험: 1,000ms↑',
  p95:  '상위 5% 느린 요청의 응답시간. 핵심 성능 지표.\n이상적: 500ms↓ / 주의: 1,000ms↑ / 위험: 2,000ms↑',
  p99:  '상위 1% 최악의 응답시간. 극단적 상황 측정.\n이상적: 1,000ms↓ / 위험: 5,000ms↑',
  rate: '전체 요청 중 정상 응답(2xx) 비율.\n이상적: 99%↑ / 주의: 95%↓ / 위험: 90%↓',
}

function fmtMs(v) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`
}

function MetricCard({ label, value, level, tipKey }) {
  const [show, setShow] = useState(false)
  const timerRef = useRef(null)

  const handleEnter = () => { timerRef.current = setTimeout(() => setShow(true), 120) }
  const handleLeave = () => { clearTimeout(timerRef.current); setShow(false) }

  return (
    <div className="bg-slate-50 rounded-xl px-3 py-3 flex flex-col gap-1 relative">
      <div className="flex items-start justify-between">
        <span className="text-[11px] text-slate-400 font-medium leading-tight">{label}</span>
        <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <button
            className="w-4 h-4 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ borderColor: 'rgb(157,157,156)' }}
            tabIndex={-1}
          >
            <span className="text-gray-400 font-semibold text-[9px]">?</span>
          </button>
          {show && (
            <div className="absolute right-0 top-5 z-50 w-56 bg-gray-900 text-white text-[11px] leading-relaxed rounded-xl px-3 py-2.5 shadow-xl whitespace-pre-line">
              {TOOLTIPS[tipKey]}
            </div>
          )}
        </div>
      </div>
      <span className="text-lg font-bold leading-none" style={{ color: LEVEL_COLORS[level] }}>{value}</span>
    </div>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow text-xs">
      <p className="text-gray-400">요청 #{payload[0].payload.req}</p>
      <p className="font-semibold text-gray-900">{payload[0].value} ms</p>
    </div>
  )
}

function CardHeader({ children }) {
  return (
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">{children}</p>
  )
}

export default function LoadTestPage() {
  const [users, setUsers]     = useState(1000)
  const [running, setRunning] = useState(false)
  const [chartData, setChart] = useState(null)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)

  const handleStart = async () => {
    setRunning(true)
    setChart(null)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/load-test/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users }),
      })

      if (!res.ok) throw new Error(`서버 오류 (${res.status})`)

      const data = await res.json()
      setResult(data)
      setChart(data.responseTimes.map((ms, i) => ({ req: i + 1, ms })))
    } catch (e) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  const res = result ?? { p50: 0, p95: 0, p99: 0, successRate: 0 }
  const rate = result ? result.successRate : 0

  const p50Level  = res.p50 > 500   ? 'danger' : 'normal'
  const p95Level  = res.p95 > 1000  ? 'danger' : 'normal'
  const p99Level  = res.p99 > 2000  ? 'danger' : 'normal'
  const rateLevel = rate    < 95    ? 'danger' : 'normal'

  const statusBadge = (() => {
    if (!result) return { label: '—', color: 'text-slate-400' }
    if (res.p95 >= 2000 || rate < 95)
      return { label: '위험', color: 'text-red-500' }
    if (res.p95 >= 500)
      return { label: '주의', color: 'text-yellow-500' }
    return { label: '양호', color: 'text-emerald-500' }
  })()

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}
    >
      <main className="flex-1 px-4 sm:px-20 md:px-40 lg:px-64 xl:px-80 py-6 pb-28">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* 사용자 수 선택 + 테스트 시작 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5 md:col-span-2 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">출석 동시 접속 부하 테스트</h1>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">
                  수업 시작 시 수백~수천 명이 동시에 출석 체크를 시도하는 상황을 시뮬레이션합니다.
                </p>
              </div>
              <div>
                <CardHeader>동시 사용자 수</CardHeader>
                <div className="flex gap-2">
                  {USER_STEPS.map((n) => (
                    <button
                      key={n}
                      onClick={() => { setUsers(n); setChart(null); setResult(null); setError(null) }}
                      disabled={running}
                      className="flex-1 rounded-xl py-2 text-xs font-semibold transition-colors border disabled:opacity-40"
                      style={{
                        backgroundColor: users === n ? D_NAVY : 'white',
                        color:           users === n ? 'white' : D_SLATE,
                        borderColor:     users === n ? D_NAVY : D_LIGHT,
                      }}
                    >
                      {n.toLocaleString()}명
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleStart}
                  disabled={running}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: running ? 'rgb(157,157,156)' : D_NAVY }}
                  onMouseEnter={(e) => { if (!running) e.currentTarget.style.backgroundColor = D_SLATE }}
                  onMouseLeave={(e) => { if (!running) e.currentTarget.style.backgroundColor = D_NAVY }}
                >
                  {running ? '테스트 중...' : '테스트 시작'}
                </button>
                {running && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full animate-pulse" style={{ width: '100%', backgroundColor: D_NAVY }} />
                  </div>
                )}
                {error && (
                  <p className="text-[11px] text-red-400 text-center">{error}</p>
                )}
              </div>
            </div>

            {/* 테스트 환경 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5 flex flex-col justify-between">
              <CardHeader>테스트 환경</CardHeader>
              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span className="text-slate-400">서버</span>
                  <span className="font-medium">홈서버 (단일 인스턴스)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">런타임</span>
                  <span className="font-medium">Spring Boot + JPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">데이터베이스</span>
                  <span className="font-medium">MySQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Auto Scaling</span>
                  <span className="font-medium text-slate-400">미적용</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">로드밸런서</span>
                  <span className="font-medium text-slate-400">미적용</span>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-300">
                * AWS 마이그레이션 후 비교 탭 추가 예정
              </div>
            </div>

            {/* 상태 요약 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5 md:col-span-2">
              <CardHeader>
                상태 요약
                {!result && <span className="ml-1 text-slate-300 normal-case font-normal">(테스트 후 표시)</span>}
              </CardHeader>
              <div className="rounded-xl bg-slate-50 px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-bold text-slate-700">{users.toLocaleString()}명 동시 접속 기준:</p>
                  <span className={`text-sm font-semibold ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
                {!result ? (
                  <p className="text-[11px] text-slate-300">테스트를 실행하면 결과가 표시됩니다.</p>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[12px] text-slate-700">p95: {fmtMs(res.p95)}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        * {p95Level === 'danger'
                          ? `상위 5% 사용자가 ${fmtMs(res.p95)} 이상 대기합니다.`
                          : '상위 5% 사용자 기준 응답시간이 양호합니다.'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-slate-700">성공률: {rate}%</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        * {rateLevel === 'danger'
                          ? `전체 요청의 ${(100 - rate).toFixed(1)}%가 실패했습니다.`
                          : '거의 모든 요청이 정상 처리됩니다.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 응답시간 차트 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
              <CardHeader>응답시간 추이 (ms)</CardHeader>
              {chartData ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 14 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(241,245,249)" />
                    <XAxis
                      dataKey="req"
                      tick={{ fontSize: 9 }}
                      label={{ value: '요청 순서', position: 'insideBottom', offset: -6, fontSize: 9 }}
                    />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="ms"
                      stroke={p95Level === 'danger' ? 'rgb(239,68,68)' : D_NAVY}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-xs text-slate-300">
                  테스트를 시작하면 차트가 표시됩니다.
                </div>
              )}
            </div>

            {/* 클라이언트 관점 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
              <CardHeader>
                클라이언트 관점
                {!result && <span className="ml-1 text-slate-300 normal-case font-normal">(테스트 후 표시)</span>}
              </CardHeader>
              {result ? (
                <div className="grid grid-cols-2 gap-2">
                  <MetricCard label="p50" value={fmtMs(res.p50)} level={p50Level} tipKey="p50" />
                  <MetricCard label="p95" value={fmtMs(res.p95)} level={p95Level} tipKey="p95" />
                  <MetricCard label="p99" value={fmtMs(res.p99)} level={p99Level} tipKey="p99" />
                  <MetricCard label="성공률" value={`${rate}%`} level={rateLevel} tipKey="rate" />
                </div>
              ) : (
                <div className="h-[100px] flex items-center justify-center text-xs text-slate-300">
                  테스트를 시작하면 결과가 표시됩니다.
                </div>
              )}
            </div>

            {/* 서버 관점 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
              <CardHeader>서버 관점</CardHeader>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-xl px-3 py-3 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 font-medium">CPU 사용률</span>
                  <span className="text-[11px] text-slate-300 mt-1">홈서버 배포 후 측정 가능</span>
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-3 flex flex-col gap-1">
                  <span className="text-[11px] text-slate-400 font-medium">메모리 사용률</span>
                  <span className="text-[11px] text-slate-300 mt-1">홈서버 배포 후 측정 가능</span>
                </div>
              </div>
            </div>

            {/* 모니터링 */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-5 flex flex-col gap-3">
              <CardHeader>모니터링</CardHeader>
              <button
                disabled
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center opacity-40 cursor-not-allowed"
                style={{ backgroundColor: D_NAVY }}
              >
                Grafana 대시보드에서 보기
              </button>
              <p className="text-[11px] text-slate-400 text-center">(홈서버 배포 후 활성화)</p>
            </div>

          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
