import { useEffect } from 'react'

function PolicyModal({ isOpen, onClose }) {
  // 모달이 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // 더 연한 반투명 배경
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">출석 정책 안내</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="px-6 py-6 space-y-6">
          {/* 출석 가능 시간 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              출석 가능 시간
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              수업 시작 기준으로
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-900">•</span>
                <span>
                  시작 전 <span className="font-semibold">10분</span> ~ 시작 후{' '}
                  <span className="font-semibold">10분</span>까지 →{' '}
                  <span className="font-semibold">출석 인정</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-900">•</span>
                <span>
                  시작 후 <span className="font-semibold">10분</span> ~{' '}
                  <span className="font-semibold">20분</span>까지 →{' '}
                  <span className="font-semibold">지각 처리</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-900">•</span>
                <span>
                  시작 후 <span className="font-semibold">20분</span> 이후 →{' '}
                  <span className="font-semibold">결석 처리</span>
                </span>
              </li>
            </ul>
          </div>

          {/* GPS 위치 확인 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              GPS 위치 확인
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              출석 시 현재 위치를 확인하여 수업 장소 근처에 있는지 검증합니다.
              <br />
              출석 시 기기의 GPS 권한을 허용부탁드립니다.
            </p>
          </div>

          {/* CAPTCHA 검증 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              CAPTCHA 검증
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              어뷰징 방지를 위해 출석 과정에서
              <br />
              CAPTCHA를 통한 간단한 확인 절차를 진행합니다.
            </p>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full rounded-2xl py-3 px-4 font-semibold text-sm text-white transition-colors"
            style={{
              backgroundColor: 'rgb(0, 170, 202)', // YU Sky Blue
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgb(21, 57, 116)' // YU Blue
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgb(0, 170, 202)' // YU Sky Blue
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default PolicyModal
