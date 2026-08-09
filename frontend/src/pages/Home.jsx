import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LifeBuoy, Cross, Utensils, Home as HomeIcon } from 'lucide-react'
import Footer from '../components/Footer'
import CategoryGrid from '../components/CategoryGrid'
import { translations } from '../assets/translations'
import { useLang } from '../hooks/useLang'
import { getAllReports } from '../api'
import heroBg from '../assets/images/hero-bg.jpg'
import volunteerHero from '../assets/images/volunteer-hero.jpg'

function Home({ isLoggedIn }) {
  if (isLoggedIn) return <VolunteerHome />
  return <VictimHome />
}

function VictimHome() {
  const [lang, setLang] = useLang()
  const t = translations[lang]

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(26,21,35,0.85), rgba(124,45,18,0.82)), url(${heroBg})` }}
      >
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
          <div className="flex justify-center gap-1.5 mb-6">
            {['en', 'hi', 'hinglish'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  lang === code ? 'bg-orange-500 text-white border-orange-500' : 'glass-card text-gray-200 border-white/20'
                }`}
              >
                {code === 'en' ? 'English' : code === 'hi' ? 'हिंदी' : 'Hinglish'}
              </button>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-gray-300 text-base mb-10 max-w-md mx-auto">
            {t.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-6 -mt-6 relative w-full">
          <CategoryGrid labels={t.categories} />
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-6 w-full">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
            <span className="text-sm font-medium text-red-700">🚨 {t.helplineTitle}</span>
            <div className="flex gap-3 text-sm">
              <a href="tel:112" className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Emergency: 112</a>
              <a href="tel:108" className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium">Ambulance: 108</a>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-4 pb-16 w-full">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 mt-8">More ways to get help</p>
          <div className="grid md:grid-cols-2 gap-3">
            <Link to="/safety" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-orange-200 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg">📖</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{t.safetyGuides}</p>
                <p className="text-xs text-gray-500">{t.safetyGuidesSub}</p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
            <Link to="/track" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-orange-200 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 text-lg">🔍</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Track my report</p>
                <p className="text-xs text-gray-500">Check status using your report ID</p>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-orange-50/60 to-amber-50/30 border-y border-orange-100/50">
        <div className="max-w-3xl mx-auto px-6 py-16 w-full">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">About RapidResponse</p>
            <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">
              A free platform connecting people affected by disasters with nearby volunteers.
              Available in English, Hindi, and Hinglish — for floods, fires, earthquakes, and more.
            </p>
          </div>

          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-6 text-center">{t.howItWorks}</p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute top-4 left-[16.67%] right-[16.67%] h-0.5 bg-orange-200 -z-0"></div>
            <div className="grid grid-cols-3 gap-4 relative">
              {[t.step1, t.step2, t.step3].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center mx-auto mb-3 relative z-10">{i + 1}</div>
                  <p className="text-xs text-gray-600 px-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function VolunteerHome() {
  const name = localStorage.getItem('name')
  const [isNew] = useState(() => {
    const flag = localStorage.getItem('isNewVolunteer') === 'true'
    if (flag) localStorage.removeItem('isNewVolunteer')
    return flag
  })
  const [stats, setStats] = useState({ total: 0, high: 0, resolved: 0 })

  useEffect(() => {
    getAllReports().then(res => {
      const data = res.data
      setStats({
        total: data.filter(r => r.status !== 'RESOLVED').length,
        high: data.filter(r => r.priority === 'High' && r.status !== 'RESOLVED').length,
        resolved: data.filter(r => r.status === 'RESOLVED').length
      })
    }).catch(() => {})
  }, [])

  const helpTypes = [
    { icon: LifeBuoy, label: 'Rescue', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Cross, label: 'Medical', color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: Utensils, label: 'Food', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: HomeIcon, label: 'Shelter', color: 'text-blue-600', bg: 'bg-blue-50' }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(26,21,35,0.88), rgba(30,58,50,0.85)), url(${volunteerHero})` }}
      >
        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full text-xs text-green-200 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            You're online as a volunteer
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
            {isNew ? `Welcome, ${name} 🎉` : `Welcome back, ${name} 👋`}
          </h1>
          <p className="text-gray-300 text-base mb-2 max-w-md mx-auto">
            {isNew
              ? "You're now a verified volunteer. Here's how RapidResponse works."
              : stats.high > 0
                ? `${stats.high} high priority report${stats.high > 1 ? 's' : ''} need attention right now.`
                : "All caught up — check the live queue for updates."}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6 relative w-full">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">Active</div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-red-600">{stats.high}</div>
            <div className="text-xs text-red-400 mt-1">Urgent</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-xs text-green-500 mt-1">Resolved</div>
          </div>
        </div>
      </div>

      {isNew && (
        <div className="max-w-3xl mx-auto px-6 pt-10 w-full">
          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6">
            <p className="text-sm font-semibold text-green-700 mb-4 text-center">How volunteering works</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                ['Browse the queue', 'See live requests sorted by urgency and category'],
                ['Pick what you can do', 'Choose based on your skills or resources'],
                ['Update as you help', 'Mark progress so others know the status']
              ].map(([title, desc], i) => (
                <div key={i}>
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-semibold flex items-center justify-center mx-auto mb-2">{i + 1}</div>
                  <p className="text-xs font-medium text-gray-800">{title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-14 w-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">How can you help?</h2>
        <p className="text-sm text-gray-500 mb-6">Pick a category to see nearby requests</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {helpTypes.map(({ icon: Icon, label, color, bg }) => (
            <Link
              key={label}
              to="/dashboard"
              state={{ category: label }}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/5 hover:-translate-y-0.5 transition"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={20} />
              </div>
              <div className="text-sm font-medium text-gray-800">{label}</div>
            </Link>
          ))}
        </div>

        <Link
          to="/dashboard"
          className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-5 transition"
        >
          <div>
            <p className="font-medium">View live queue</p>
            <p className="text-sm text-gray-400">See all active reports, sorted by urgency</p>
          </div>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}

export default Home