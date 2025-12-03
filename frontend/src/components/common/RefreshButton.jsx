/**
 * 재조회 버튼 공통 컴포넌트
 * @param {Function} onClick - 재조회 버튼 클릭 핸들러
 * @param {boolean} isRefreshing - 재조회 중 여부
 * @param {boolean} disabled - 비활성화 여부 (optional)
 */
function RefreshButton({ onClick, isRefreshing = false, disabled = false }) {
  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={onClick}
        disabled={disabled || isRefreshing}
        className={`px-6 py-2 rounded-xl border-2 transition-all duration-200 ${
          isRefreshing 
            ? 'opacity-75 cursor-wait' 
            : disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-50 active:scale-95'
        }`}
        style={{
          borderColor: 'rgb(0, 170, 202)',
          color: 'rgb(0, 170, 202)',
        }}
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-sm font-medium">
            {isRefreshing ? '조회 중...' : '재조회'}
          </span>
        </div>
      </button>
    </div>
  )
}

export default RefreshButton

