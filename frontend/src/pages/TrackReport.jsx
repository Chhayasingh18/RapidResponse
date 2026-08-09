import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { getAllReports } from '../api'

const statusLabel = {
  PENDING: { label: 'Requested', step: 1 },
  IN_PROGRESS: { label: 'Volunteer assigned', step: 2 },
  RESOLVED: { label: 'Resolved', step: 3 }
}

function TrackReport() {
  const [reportId, setReportId] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setReport(null)
    setLoading(true)
    try {
      const res = await getAllReports()
      const found = res.data.find(r => String(r.id) === reportId.trim())
      if (found) setReport(found)
      else setError('No report found with this ID')
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const info = report ? statusLabel[report.status] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-white px-6 py-16">
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 w-fit">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 border border-orange-100/50 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Track your report</h1>
          <p className="text-gray-500 text-sm mb-6">Enter the report ID you received after submitting</p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="e.g. 4"
              required
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 rounded-xl transition disabled:opacity-50"
            >
              <Search size={18} />
            </button>
          </form>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          {report && (
            <div className="border border-gray-100 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.category} · {report.location}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{report.description}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-700 border border-orange-100">
                  {report.priority}
                </span>
              </div>

              <div className="flex items-center justify-center py-4">
                {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map((s, i) => {
                  const stepInfo = statusLabel[s]
                  const isDone = info.step >= stepInfo.step
                  return (
                    <div key={s} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center ${
                          isDone ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {stepInfo.step}
                        </div>
                        <p className={`text-[10px] mt-1.5 w-16 text-center ${isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                          {stepInfo.label}
                        </p>
                      </div>
                      {i < 2 && <div className={`w-8 h-0.5 mb-4 ${info.step > stepInfo.step ? 'bg-orange-400' : 'bg-gray-200'}`}></div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrackReport