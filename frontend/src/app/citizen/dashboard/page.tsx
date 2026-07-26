'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { Citizen, ApplicationListItem, PagedResult, ApiResponse, CitizenNotificationDto } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700', Submitted: 'bg-blue-100 text-blue-700',
  UnderReview: 'bg-indigo-100 text-indigo-700', DocumentVerification: 'bg-yellow-100 text-yellow-700',
  PaymentPending: 'bg-amber-100 text-amber-700', PoliceVerification: 'bg-orange-100 text-orange-700',
  SupervisorApproval: 'bg-purple-100 text-purple-700', Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700', Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700', Archived: 'bg-slate-100 text-slate-700',
}

export default function CitizenDashboardPage() {
  const router = useRouter()
  const [citizen, setCitizen] = useState<Citizen | null>(null)
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [notifications, setNotifications] = useState<CitizenNotificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    loadData(token)
  }, [router])

  const loadData = async (token: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const [citizenRes, appsRes, notifRes] = await Promise.all([
        api.get<ApiResponse<Citizen>>('/Citizens/me', config),
        api.get<ApiResponse<PagedResult<ApplicationListItem>>>('/Applications?pageSize=5', config),
        api.get<ApiResponse<CitizenNotificationDto[]>>('/citizen/Notifications?unreadOnly=true', config),
      ])
      setCitizen(citizenRes.data.data)
      setApplications(appsRes.data.data.items)
      setNotifications(notifRes.data.data)
    } catch {
      localStorage.removeItem('citizenToken'); router.replace('/citizen/login')
    } finally { setLoading(false) }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('citizen.welcome', { name: citizen?.fullName || '' })}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/citizen/applications" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">{citizen?.activeApplications || 0}</div>
          <div className="text-sm text-gray-500">{t('citizen.activeApplications')}</div>
        </Link>
        <Link href="/citizen/applications" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">{citizen?.completedApplications || 0}</div>
          <div className="text-sm text-gray-500">{t('citizen.completedApplications')}</div>
        </Link>
        <Link href="/citizen/notifications" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-amber-600">{notifications.length}</div>
          <div className="text-sm text-gray-500">{t('notifications.unread')}</div>
        </Link>
        <Link href="/citizen/services" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-purple-600">🏛️</div>
          <div className="text-sm text-gray-500">{t('citizen.applyService')}</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-4">{t('citizen.myApplications')}</h2>
          {applications.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>{t('common.noData')}</p>
              <Link href="/citizen/services" className="text-green-600 hover:underline text-sm">{t('citizen.applyService')}</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Link key={app.id} href={`/citizen/applications/${app.id}`} className="block p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{app.applicationNumber}</div>
                      <div className="text-xs text-gray-500">{app.serviceName}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>{app.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-4">{t('citizen.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/citizen/services" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">🏛️ {t('citizen.applyService')}</Link>
            <Link href="/citizen/appointments" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">📅 {t('citizen.appointments')}</Link>
            <Link href="/citizen/complaints" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">⚠️ {t('citizen.submitComplaint')}</Link>
            <Link href="/citizen/feedback" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">⭐ {t('citizen.feedback')}</Link>
            <Link href="/citizen/documents" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">📄 {t('citizen.myDocuments')}</Link>
            <Link href="/citizen/profile" className="p-4 border rounded-lg hover:bg-green-50 text-center text-sm font-medium">👤 {t('profile.title')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
