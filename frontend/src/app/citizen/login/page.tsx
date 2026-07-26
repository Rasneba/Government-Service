'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { citizenLogin, isAuthenticated } from '@/lib/auth'
import { Phone, Lock, Loader2, Shield } from 'lucide-react'
import { useTranslation } from '@/lib/I18nContext'

export default function CitizenLoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem('citizenToken')) {
      router.replace('/citizen/dashboard')
    }
  }, [router])

  if (!mounted) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await citizenLogin(phoneNumber, password)
      router.push('/citizen/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid phone number or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('citizen.dashboard')}</h1>
          <p className="text-gray-500 mt-2">{t('citizen.welcome', { name: '' })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phoneNumber')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder={t('auth.phoneNumber')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder={t('auth.password')}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? t('auth.loggingIn') : t('auth.loggingIn')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            {t('auth.dontHaveAccount')}{' '}
            <a href="/citizen/register" className="text-green-600 hover:text-green-700 font-medium">
              {t('auth.register')}
            </a>
          </p>
          <a href="/login" className="text-sm text-gray-400 hover:text-gray-600 inline-block">
            Staff login instead
          </a>
        </div>
      </div>
    </div>
  )
}
