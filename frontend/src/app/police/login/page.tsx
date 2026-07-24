'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { policeLogin } from '@/lib/auth'

export default function PoliceLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await policeLogin(username, password)
      const role = result.user?.role
      if (role !== 'PoliceAdministrator') {
        localStorage.removeItem('policeToken')
        localStorage.removeItem('policeUser')
        setError('Access denied. Police accounts only.')
        setLoading(false)
        return
      }
      router.push('/police/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Police Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Sub-City Certificate Verification System</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                required placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                required placeholder="Enter password"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-700">Back to Home</a>
          </div>

          <div className="mt-4 bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Police Officer: <span className="font-mono">police1 / Police@123</span></p>
            <p>Investigation: <span className="font-mono">police2 / Police@123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
