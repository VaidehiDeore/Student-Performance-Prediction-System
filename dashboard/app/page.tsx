'use client'

import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    gender: 'Female',
    attendance_pct: 75,
    study_hours_wk: 6,
    quiz_avg: 60,
    assignment_score: 65,
    midterm_score: 58,
    lms_logins_wk: 5,
    forum_posts: 2,
    previous_gpa: 7,
    sleep_hours: 6,
    internet_access: 'Yes',
    parent_education: 'Graduate'
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const value =
      e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value

    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setResult(data)
    } catch {
      alert('Backend is not running. Start FastAPI first.')
    }

    setLoading(false)
  }

  const bars = [
    { label: 'Attend', value: formData.attendance_pct },
    { label: 'Quiz', value: formData.quiz_avg },
    { label: 'Assign', value: formData.assignment_score },
    { label: 'Midterm', value: formData.midterm_score },
    { label: 'GPA', value: Math.round(formData.previous_gpa * 10) }
  ]

  const metrics = [
    { label: 'Attendance', value: formData.attendance_pct },
    { label: 'Quiz', value: formData.quiz_avg },
    { label: 'Assignment', value: formData.assignment_score },
    { label: 'Midterm', value: formData.midterm_score }
  ]

  return (
    <main className="min-h-screen bg-[#2b3357] text-white p-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#4b63c9] rounded-bl-full opacity-70"></div>

      <section className="relative max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-3">Dashboard for Student</h1>

        <div className="bg-slate-200 text-[#202844] px-10 py-3 rounded-r-full w-fit font-bold mb-12">
          Dark mode
        </div>

        <div className="grid grid-cols-12 gap-6 bg-[#252d4d] rounded-[32px] p-6 shadow-2xl">

          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 bg-[#333b5e] rounded-[28px] p-6">
            <h2 className="text-xl font-bold mb-8">🎓 Smart</h2>

            <nav className="space-y-5 text-sm">
              <p className="bg-[#202844] px-4 py-3 rounded-xl font-semibold">📊 Dashboard</p>
              <p>📚 Performance</p>
              <p>📝 Prediction</p>
              <p>📅 Risk Alerts</p>
              <p>💬 Interventions</p>
              <p>⚙️ Settings</p>
            </nav>

            <p className="mt-28 text-sm">↪ Log Out</p>
          </aside>

          {/* Middle Dashboard */}
          <section className="col-span-12 md:col-span-6 space-y-6">

            {/* Welcome */}
            <div className="bg-[#5d78e5] rounded-[28px] p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Hello Student!</h2>
                <p className="text-sm mt-2 text-blue-100">
                  Enter academic signals and check performance risk instantly.
                </p>
              </div>
              <div className="text-6xl">👨‍🎓</div>
            </div>

            {/* Bar Graph */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold">📊 Performance Overview</h2>
                  <p className="text-xs text-gray-300">Live values from student input</p>
                </div>
                <span className="text-xs bg-[#202844] px-3 py-2 rounded-full">
                  Current Data
                </span>
              </div>

              <div className="flex items-end justify-between gap-3 h-44">
                {bars.map((item) => (
                  <div key={item.label} className="flex flex-col items-center flex-1">
                    <div className="w-full max-w-[42px] h-36 bg-[#252d4d] rounded-xl flex items-end overflow-hidden">
                      <div
                        className="w-full bg-[#5d78e5] rounded-xl"
                        style={{
                          height: `${Math.min(item.value, 100)}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-gray-300">{item.label}</p>
                    <p className="text-xs font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Circular Metrics */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <h2 className="text-lg font-bold mb-5">🎯 Academic Metrics</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((item) => (
                  <div key={item.label} className="bg-[#252d4d] rounded-2xl p-4 text-center">
                    <div
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(#5d78e5 ${Math.min(item.value, 100) * 3.6}deg, #475171 0deg)`
                      }}
                    >
                      <div className="w-14 h-14 bg-[#252d4d] rounded-full flex items-center justify-center text-sm font-bold">
                        {item.value}%
                      </div>
                    </div>
                    <p className="text-xs mt-3 text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <h2 className="text-xl font-bold mb-5">Student Input Data</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-dark"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>

                <select
                  name="internet_access"
                  value={formData.internet_access}
                  onChange={handleChange}
                  className="input-dark"
                >
                  <option value="Yes">Internet: Yes</option>
                  <option value="No">Internet: No</option>
                </select>

                <select
                  name="parent_education"
                  value={formData.parent_education}
                  onChange={handleChange}
                  className="input-dark md:col-span-2"
                >
                  <option value="High School">Parent Education: High School</option>
                  <option value="Graduate">Parent Education: Graduate</option>
                  <option value="Post Graduate">Parent Education: Post Graduate</option>
                </select>

                {[
                  ['attendance_pct', 'Attendance %'],
                  ['study_hours_wk', 'Study Hours / Week'],
                  ['quiz_avg', 'Quiz Average'],
                  ['assignment_score', 'Assignment Score'],
                  ['midterm_score', 'Midterm Score'],
                  ['lms_logins_wk', 'LMS Logins / Week'],
                  ['forum_posts', 'Forum Posts'],
                  ['previous_gpa', 'Previous GPA'],
                  ['sleep_hours', 'Sleep Hours']
                ].map(([name, label]) => (
                  <input
                    key={name}
                    name={name}
                    type="number"
                    step="0.1"
                    value={(formData as any)[name]}
                    placeholder={label}
                    onChange={handleChange}
                    className="input-dark"
                  />
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 bg-[#5d78e5] hover:bg-[#708cff] px-6 py-3 rounded-xl font-bold transition shadow-lg"
              >
                {loading ? 'Predicting...' : 'Predict Performance'}
              </button>
            </div>
          </section>

          {/* Right Panel */}
          <section className="col-span-12 md:col-span-3 space-y-6">

            {/* Prediction Result */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <h2 className="text-xl font-bold mb-5">Prediction Result</h2>

              {result ? (
                <div className="space-y-4">
                  <div className="bg-[#edf1ff] text-[#202844] rounded-2xl p-5 text-center">
                    <p className="text-sm font-semibold">Predicted Grade</p>
                    <p className="text-6xl font-black text-[#5d78e5]">
                      {result.predicted_grade}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#252d4d] rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-300">Confidence</p>
                      <p className="text-2xl font-bold">{result.confidence}%</p>
                    </div>

                    <div className="bg-[#252d4d] rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-300">Risk</p>
                      <p
                        className={`text-lg font-bold ${
                          result.risk_level === 'Low Risk'
                            ? 'text-green-400'
                            : result.risk_level === 'Medium Risk'
                            ? 'text-yellow-300'
                            : 'text-red-400'
                        }`}
                      >
                        {result.risk_level}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white text-[#202844] rounded-2xl p-4">
                    <p className="font-bold">🚨 Alert</p>
                    <p className="text-sm mb-3">{result.alert}</p>

                    <p className="font-bold">💡 Intervention</p>
                    <p className="text-sm">{result.intervention}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm">
                  Prediction output will appear here after entering student details.
                </p>
              )}
            </div>

            {/* Risk Guide */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <h2 className="text-xl font-bold mb-4">Risk Guide</h2>

              <div className="space-y-3 text-sm">
                <p className="bg-green-400/20 text-green-300 p-3 rounded-xl">
                  Low Risk: Student is on track
                </p>

                <p className="bg-yellow-400/20 text-yellow-300 p-3 rounded-xl">
                  Medium Risk: Needs monitoring
                </p>

                <p className="bg-red-400/20 text-red-300 p-3 rounded-xl">
                  High Risk: Immediate support
                </p>
              </div>
            </div>

            {/* Mini Intervention Plan */}
            <div className="bg-[#333b5e] rounded-[28px] p-6">
              <h2 className="text-xl font-bold mb-4">Intervention Plan</h2>

              <div className="space-y-3 text-sm">
                <div className="bg-[#252d4d] p-3 rounded-xl">
                  ✅ Improve attendance consistency
                </div>
                <div className="bg-[#252d4d] p-3 rounded-xl">
                  📚 Weekly quiz practice
                </div>
                <div className="bg-[#252d4d] p-3 rounded-xl">
                  🧑‍🏫 Mentor support sessions
                </div>
              </div>
            </div>

          </section>
        </div>
      </section>
    </main>
  )
}