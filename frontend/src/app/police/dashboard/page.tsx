'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { policeLogout } from '@/lib/auth'
import type { PoliceStats, ApplicationListItem, ApiResponse, PagedResult } from '@/types'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'
import { useTranslation } from '@/lib/I18nContext'

export default function PoliceDashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [stats, setStats] = useState<PoliceStats | null>(null)
  const [pendingApps, setPendingApps] = useState<ApplicationListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('policeToken')
    if (!token) { router.replace('/police/login'); return }

    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      api.get<ApiResponse<PoliceStats>>('/Police/stats', { headers }),
      api.get<ApiResponse<PagedResult<ApplicationListItem>>>('/Police/pending?pageSize=10', { headers })
    ]).then(([statsRes, pendingRes]) => {
      setStats(statsRes.data.data)
      setPendingApps(pendingRes.data.data.items)
    }).finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-slate-500">{t('common.loading')}</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-lg font-bold">{t('police.title')}</h1>
        </div>
        <button onClick={() => policeLogout()} className="text-sm text-slate-300 hover:text-white">{t('auth.logout')}</button>
        <LanguageSwitcher />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('dashboard.title')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="text-sm text-slate-500">{t('police.pendingVerifications')}</div>
            <div className="text-3xl font-bold text-amber-600 mt-1">{stats?.pendingVerifications ?? 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="text-sm text-slate-500">Approved Today</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{stats?.approvedToday ?? 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="text-sm text-slate-500">Rejected Today</div>
            <div className="text-3xl font-bold text-red-600 mt-1">{stats?.rejectedToday ?? 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="text-sm text-slate-500">{t('police.reviewed')}</div>
            <div className="text-3xl font-bold text-blue-600 mt-1">{stats?.totalReviewed ?? 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{t('police.pendingVerifications')}</h3>
          </div>
          {pendingApps.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">{t('common.noData')}</div>
          ) : (
            <div className="divide-y">
              {pendingApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => router.push(`/police/applications/${app.id}`)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-slate-600">{app.applicationNumber}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                        {app.reissueReason || 'Reissue'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{app.serviceName} — {app.citizenName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</div>
                    {app.isOverdue && <span className="text-xs text-red-500 font-medium">{t('dashboard.overdue')}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
