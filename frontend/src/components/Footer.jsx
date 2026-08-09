import { Waves, Flame, Mountain, Wind, Building2, Cross } from 'lucide-react'

const hazards = [
  { icon: Waves, label: 'Flood' },
  { icon: Flame, label: 'Fire' },
  { icon: Mountain, label: 'Earthquake' },
  { icon: Wind, label: 'Cyclone' },
  { icon: Building2, label: 'Building collapse' },
  { icon: Cross, label: 'Medical' }
]

function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-12 mt-auto bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 26 26">
                <circle cx="13" cy="13" r="12" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.25" />
                <path d="M13 5 L13 13 L18 16" stroke="#EA580C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <circle cx="13" cy="13" r="2.4" fill="#EA580C" />
              </svg>
              <span className="font-semibold text-gray-900 text-sm">RapidResponse</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              An AI-powered disaster coordination platform. Report an emergency in your own language —
              our system prioritizes it instantly and connects you with nearby volunteers.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Supported emergencies</p>
            <div className="grid grid-cols-2 gap-2">
              {hazards.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-100 px-2.5 py-1.5 rounded-lg">
                  <Icon size={14} className="text-orange-500" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Emergency helplines</p>
            <div className="space-y-2 text-sm">
              <a href="tel:112" className="block text-gray-600 hover:text-orange-600">National Emergency — 112</a>
              <a href="tel:108" className="block text-gray-600 hover:text-orange-600">Ambulance — 108</a>
              <a href="tel:101" className="block text-gray-600 hover:text-orange-600">Fire — 101</a>
              <a href="tel:100" className="block text-gray-600 hover:text-orange-600">Police — 100</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-xs text-gray-400 text-center">
          RapidResponse — a student project built for disaster response coordination
        </div>
      </div>
    </footer>
  )
}

export default Footer