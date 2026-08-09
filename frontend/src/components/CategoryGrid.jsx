import { useNavigate } from 'react-router-dom'
import { LifeBuoy, Cross, Utensils, Home as HomeIcon } from 'lucide-react'

export const categoryConfig = {
  Rescue: { icon: LifeBuoy, color: 'text-red-600', bg: 'bg-red-50' },
  Medical: { icon: Cross, color: 'text-rose-600', bg: 'bg-rose-50' },
  Food: { icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50' },
  Shelter: { icon: HomeIcon, color: 'text-blue-600', bg: 'bg-blue-50' }
}

function CategoryGrid({ labels }) {
  const navigate = useNavigate()

  const goToReport = (category) => {
    navigate('/report', { state: { category } })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Object.keys(categoryConfig).map((key) => {
        const { icon: Icon, color, bg } = categoryConfig[key]
        return (
          <button
            key={key}
            onClick={() => goToReport(key)}
            className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/5 hover:-translate-y-0.5 transition"
          >
            <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mx-auto mb-2.5`}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="text-sm font-medium text-gray-800">{labels[key]}</div>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryGrid