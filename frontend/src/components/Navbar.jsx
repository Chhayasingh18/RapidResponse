import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function Navbar({ isLoggedIn }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    window.dispatchEvent(new Event('auth-change'))
    setMenuOpen(false)
    navigate('/')
}

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <svg width="22" height="22" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="12" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.25" />
            <path d="M13 5 L13 13 L18 16" stroke="#EA580C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="13" cy="13" r="2.4" fill="#EA580C" />
          </svg>
          <span className="font-semibold text-gray-900 text-sm">RapidResponse</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-gray-900">Log out</button>
            </>
          ) : (
            <>
              <Link to="/safety" className="hover:text-gray-900">Safety</Link>
              <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg transition">
                Volunteer login
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3 text-sm text-gray-600">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left">Log out</button>
            </>
          ) : (
            <>
              <Link to="/safety" onClick={() => setMenuOpen(false)}>Safety</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-center">
                Volunteer login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar