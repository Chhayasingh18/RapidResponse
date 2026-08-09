import { useState } from 'react'
import { useLocation as useRouterLocation, Link } from 'react-router-dom'
import { MapPin, Check } from 'lucide-react'
import { translations, categoryIcons } from '../assets/translations'
import { createReport } from '../api'
import { useLang } from '../hooks/useLang'


function ReportForm() {
  const routerLocation = useRouterLocation()
  const preselectedCategory = routerLocation.state?.category || null

  const [lang, setLang] = useLang()
  const t = translations[lang]

  const [formData, setFormData] = useState({
    description: '', reporterName: '', contactNumber: '', location: '', latitude: null, longitude: null
})
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationCaptured, setLocationCaptured] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleUseLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setFormData({
          ...formData,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          latitude,
          longitude
        })
        setLocationCaptured(true)
        setLocating(false)
      },
      () => setLocating(false)
    )
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const payload = preselectedCategory
        ? { ...formData, description: `[${preselectedCategory}] ${formData.description}` }
        : formData
      const response = await createReport(payload)
      setResult(response.data)
      setStatus('success')
      setFormData({ description: '', reporterName: '', contactNumber: '', location: '', latitude: null, longitude: null })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-white relative overflow-hidden">
      <div className="animate-float1 absolute top-10 -right-20 w-72 h-72 rounded-full bg-orange-200/40 blur-3xl"></div>
      <div className="animate-float2 absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl"></div>

      <div className="relative max-w-lg mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">← Back</Link>
          <div className="flex gap-1.5">
            {['en', 'hi', 'hinglish'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  lang === code ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {code === 'en' ? 'English' : code === 'hi' ? 'हिंदी' : 'Hinglish'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 border border-orange-100/50 p-8">
          {preselectedCategory && (
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              {categoryIcons[preselectedCategory]} {t.categories[preselectedCategory]}
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.title}</h1>
          <p className="text-gray-500 text-sm mb-8">{t.subtitle}</p>

          {status === 'success' ? (
            <StatusStepper t={t} result={result} onReset={() => setStatus('idle')} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.description}</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  placeholder={t.descriptionPlaceholder} required rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name}</label>
                  <input
                    type="text" name="reporterName" value={formData.reporterName} onChange={handleChange}
                    placeholder={t.namePlaceholder} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.contact}</label>
                  <input
                    type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                    placeholder={t.contactPlaceholder} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.location}</label>
                <div className="flex gap-2">
                  <input
                    type="text" name="location" value={formData.location} onChange={handleChange}
                    placeholder={t.locationPlaceholder} required
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
                  />
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={locating}
                    className={`px-4 rounded-xl border text-sm flex items-center gap-1.5 transition ${
                      locationCaptured ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    {locationCaptured ? <Check size={16} /> : <MapPin size={16} />}
                  </button>
                </div>
                {locating && <p className="text-xs text-gray-400 mt-1">Getting location...</p>}
                {locationCaptured && <p className="text-xs text-green-600 mt-1">{t.locationFound}</p>}
              </div>

              {status === 'error' && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{t.error}</p>}

              <button
                type="submit" disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-600/25 transition disabled:opacity-50"
              >
                {status === 'submitting' ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusStepper({ t, result, onReset }) {
  const steps = [t.statusRequested, t.statusPriority, t.statusQueue]
  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl mx-auto mb-5">✓</div>
      <p className="text-gray-900 font-semibold mb-1">{t.success}</p>
      <p className="text-gray-500 text-sm mb-6">{t.successDetail}</p>

      <div className="flex items-center justify-center mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 w-16 text-center">{step}</p>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-orange-200 mb-4"></div>}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 text-xs mb-6">
        <span className="bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full text-orange-700 font-medium">
          {result?.category}
        </span>
        <span className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-full text-red-700 font-medium">
          {result?.priority} priority
        </span>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
  <p className="text-xs text-gray-500">Your report ID — save this to track status later</p>
  <p className="text-lg font-bold text-gray-900">#{result?.id}</p>
</div>
<p className="text-xs text-gray-400 mb-4">
  {t.trackNote}
</p>
      <button onClick={onReset} className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition">
        Submit another report
      </button>
    </div>
  )
}

export default ReportForm