import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Waves, Flame, Mountain, Wind, ChevronDown, ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'
import { translations } from '../assets/translations'
import { useLang } from '../hooks/useLang'
import floodImg from '../assets/images/flood.jpg'
import fireImg from '../assets/images/fire.jpg'
import earthquakeImg from '../assets/images/earthquake.jpg'
import cycloneImg from '../assets/images/cyclone.jpg'

function SafetyGuides() {
  const [lang, setLang] = useLang()
  const t = translations[lang].safety
  const [open, setOpen] = useState(null)

  const guides = [
    { key: 'flood', icon: Waves, color: 'text-blue-600', bg: 'bg-blue-50', image: floodImg, data: t.flood },
    { key: 'fire', icon: Flame, color: 'text-red-600', bg: 'bg-red-50', image: fireImg, data: t.fire },
    { key: 'earthquake', icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', image: earthquakeImg, data: t.earthquake },
    { key: 'cyclone', icon: Wind, color: 'text-slate-600', bg: 'bg-slate-50', image: cycloneImg, data: t.cyclone }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft size={14} /> {translations[lang].back}
          </Link>
          <div className="flex gap-1.5">
            {['en', 'hi', 'hinglish'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  lang === code ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {code === 'en' ? 'English' : code === 'hi' ? 'हिंदी' : 'Hinglish'}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.pageTitle}</h1>
        <p className="text-gray-500 text-sm mb-8">{t.pageSubtitle}</p>

        <div className="space-y-3">
          {guides.map((g) => {
            const Icon = g.icon
            const isOpen = open === g.key
            return (
              <div key={g.key} className="border border-gray-100 rounded-2xl overflow-hidden">
                <img src={g.image} alt={g.data.title} className="w-full h-32 object-cover" />
                <button
                  onClick={() => setOpen(isOpen ? null : g.key)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${g.bg} ${g.color} flex items-center justify-center`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-medium text-gray-900">{g.data.title}</span>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-2">{t.do}</p>
                      <ul className="space-y-1.5">
                        {g.data.dos.map((d, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-green-600">✓</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-2">{t.dont}</p>
                      <ul className="space-y-1.5">
                        {g.data.donts.map((d, i) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-red-600">✕</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SafetyGuides