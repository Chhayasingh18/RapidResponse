import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartHandshake } from 'lucide-react'
import { login, register } from '../api'

function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let response
      if (mode === 'login') response = await login(formData.email, formData.password)
      else response = await register({ ...formData, role: 'VOLUNTEER' })

      localStorage.setItem('token', response.data.token)
localStorage.setItem('name', response.data.name)
localStorage.setItem('role', response.data.role)
if (mode === 'register') {
  localStorage.setItem('isNewVolunteer', 'true')
}
window.dispatchEvent(new Event('auth-change'))
navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-white relative overflow-hidden flex items-center justify-center px-6">
      <div className="animate-float1 absolute top-0 -right-20 w-72 h-72 rounded-full bg-orange-200/40 blur-3xl"></div>
      <div className="animate-float2 absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl"></div>

      <div className="relative max-w-sm w-full">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">← Back</Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 border border-orange-100/50 p-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
  <HeartHandshake size={22} />
</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Join as a volunteer'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {mode === 'login' ? 'Log in to access the live dashboard' : 'Start helping your community today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-600/25 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-orange-600 font-medium hover:underline"
            >
              {mode === 'login' ? 'Register' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login