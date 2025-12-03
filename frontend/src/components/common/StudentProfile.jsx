function StudentProfile({ studentInfo }) {
  return (
    <div className="mb-6 bg-slate-30 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {studentInfo.name}
            </span>
            <span className="text-sm text-gray-600">
              {studentInfo.studentId}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">
            {studentInfo.department}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile

