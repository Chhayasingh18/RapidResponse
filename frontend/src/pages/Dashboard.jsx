import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LifeBuoy, Cross, Utensils, Home as HomeIcon, Inbox, ArrowLeft, Navigation } from 'lucide-react'
import { getAllReports, updateReportStatus } from '../api'
import volunteerHero from '../assets/images/volunteer-hero.jpg'

const categoryConfig = {
  Medical: { icon: Cross, color: 'text-rose-600', bg: 'bg-rose-50' },
  Food: { icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50' },
  Rescue: { icon: LifeBuoy, color: 'text-red-600', bg: 'bg-red-50' },
  Shelter: { icon: HomeIcon, color: 'text-blue-600', bg: 'bg-blue-50' }
}

const priorityStyle = {
  High: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-100' },
  Medium: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  Low: { dot: 'bg-gray-400', badge: 'bg-gray-50 text-gray-600 border-gray-200' }
}

// Haversine formula — do lat/lng points ke beech distance nikalta hai (km mein)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function Dashboard() {
  const navigate = useNavigate()
  const routerLocation = useLocation()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState(routerLocation.state?.category || 'All')
  const [hideResolved, setHideResolved] = useState(true)
  const [myLocation, setMyLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [sortByDistance, setSortByDistance] = useState(false)
  const name = localStorage.getItem('name')

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await getAllReports()
      const order = { High: 0, Medium: 1, Low: 2 }
      setReports(response.data.sort((a, b) => order[a.priority] - order[b.priority]))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSortByDistance(true)
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReportStatus(id, newStatus)
      fetchReports()
    } catch (err) {
      alert('Session expired, please log in again')
      navigate('/login')
    }
  }

  let filtered = reports.filter(r => {
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false
    if (hideResolved && r.status === 'RESOLVED') return false
    return true
  })

  // Distance calculate karo har report ke liye (agar dono ke paas coordinates hain)
  filtered = filtered.map(r => {
    if (myLocation && r.latitude && r.longitude) {
      return { ...r, distanceKm: getDistanceKm(myLocation.lat, myLocation.lng, r.latitude, r.longitude) }
    }
    return { ...r, distanceKm: null }
  })

  if (sortByDistance && myLocation) {
    filtered = [...filtered].sort((a, b) => {
      if (a.distanceKm === null) return 1
      if (b.distanceKm === null) return -1
      return a.distanceKm - b.distanceKm
    })
  }

  const highCount = reports.filter(r => r.priority === 'High' && r.status !== 'RESOLVED').length

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(26,21,35,0.9), rgba(30,58,50,0.85)), url(${volunteerHero})` }}
      >
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-16">
          <Link to="/" className="text-sm text-gray-300 hover:text-white flex items-center gap-1 mb-3 w-fit">
            <ArrowLeft size={14} /> Home
          </Link>
          <p className="text-sm text-gray-300">Welcome back, {name}</p>
          <h1 className="text-2xl font-bold text-white">Live queue</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-10 pb-10 relative">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-gray-900/5">
            <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Total reports</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg shadow-red-500/20">
            <div className="text-2xl font-bold text-white">{highCount}</div>
            <div className="text-xs text-red-100 mt-0.5">Urgent now</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg shadow-green-500/20">
            <div className="text-2xl font-bold text-white">{reports.filter(r => r.status === 'RESOLVED').length}</div>
            <div className="text-xs text-green-100 mt-0.5">Resolved</div>
          </div>
        </div>

        {/* Location + distance sort */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Navigation size={16} className={myLocation ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-sm text-gray-600">
              {myLocation ? 'Sorted by distance from you' : 'Share your location to see nearby requests first'}
            </span>
          </div>
          <button
            onClick={handleUseMyLocation}
            disabled={locating}
            className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {locating ? 'Locating...' : myLocation ? 'Update location' : 'Use my location'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`text-sm px-4 py-2 rounded-xl border font-medium transition ${
              categoryFilter === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {Object.keys(categoryConfig).map(cat => {
            const { icon: Icon, color } = categoryConfig[cat]
            const active = categoryFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border font-medium transition ${
                  active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Icon size={14} className={active ? 'text-white' : color} />
                {cat}
                <span className={`text-xs ${active ? 'text-gray-300' : 'text-gray-400'}`}>
                  {reports.filter(r => r.category === cat).length}
                </span>
              </button>
            )
          })}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500 mb-6 cursor-pointer w-fit">
          <input type="checkbox" checked={hideResolved} onChange={(e) => setHideResolved(e.target.checked)} className="rounded" />
          Hide resolved reports
        </label>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Inbox size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No reports match this filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((report) => {
              const p = priorityStyle[report.priority] || priorityStyle.Low
              const cat = categoryConfig[report.category] || categoryConfig.Shelter
              const CatIcon = cat.icon
              return (
                <div
                  key={report.id}
                  className="bg-white border-l-4 border-y border-r border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                  style={{
                    borderLeftColor:
                      report.category === 'Medical' ? '#fb7185' :
                      report.category === 'Food' ? '#f59e0b' :
                      report.category === 'Rescue' ? '#ef4444' : '#3b82f6'
                  }}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center flex-shrink-0`}>
                      <CatIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{report.category}</p>
                            <span className="text-gray-300">·</span>
                            <p className="text-sm text-gray-500">{report.location}</p>
                            {report.distanceKm !== null && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                {report.distanceKm.toFixed(1)} km away
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                          <p className="text-xs text-gray-400 mt-1.5">{report.reporterName} · {report.contactNumber}</p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap ${p.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                          {report.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-gray-50">
                        <span className="text-xs text-gray-400">Status</span>
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-400 bg-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard