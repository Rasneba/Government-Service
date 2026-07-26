'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import api from '@/lib/api'
import type { ApplicationListItem, PagedResult, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  UnderReview: 'bg-indigo-100 text-indigo-700',
  DocumentVerification: 'bg-yellow-100 text-yellow-700',
  PaymentPending: 'bg-amber-100 text-amber-700',
  PoliceVerification: 'bg-orange-100 text-orange-700',
  SupervisorApproval: 'bg-purple-100 text-purple-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
  Archived: 'bg-slate-100 text-slate-700',
}

export default function ApplicationsPage() {
  const { t } = useTranslation()
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const pageSize = 20

  useEffect(() => { loadApplications() }, [page, statusFilter])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() })
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get<ApiResponse<PagedResult<ApplicationListItem>>>(`/Applications?${params}`)
      setApplications(res.data.data.items)
      setTotalCount(res.data.data.totalCount)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('applications.title')}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage certificate reissue and service applications</p>
          </div>
          <Link href="/applications/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            {t('applications.newApplication')}
          </Link>
        </div>

        <div className="mb-4 flex gap-2 flex-wrap">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">{t('common.all')}</option>
            <option value="Submitted">{t('status.submitted')}</option>
            <option value="DocumentVerification">{t('status.documentVerification')}</option>
            <option value="UnderReview">{t('status.underReview')}</option>
            <option value="PoliceVerification">{t('status.policeVerification')}</option>
            <option value="SupervisorApproval">{t('status.supervisorApproval')}</option>
            <option value="Approved">{t('status.approved')}</option>
            <option value="Completed">{t('status.completed')}</option>
            <option value="Rejected">{t('status.rejected')}</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t('common.noData')}</div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">{t('applications.applicationNumber')}</th>
                  <th className="text-left px-4 py-3 font-medium">{t('applications.serviceType')}</th>
                  <th className="text-left px-4 py-3 font-medium">{t('applications.citizen')}</th>
                  <th className="text-left px-4 py-3 font-medium">{t('applications.reissueReason')}</th>
                  <th className="text-left px-4 py-3 font-medium">{t('common.status')}</th>
                  <th className="text-left px-4 py-3 font-medium">Police</th>
                  <th className="text-left px-4 py-3 font-medium">{t('applications.currentStep')}</th>
                  <th className="text-left px-4 py-3 font-medium">{t('common.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/applications/${app.id}`} className="text-blue-600 hover:underline font-medium">{app.applicationNumber}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>{app.serviceName}</div>
                      <div className="text-xs text-gray-400">{app.serviceCode}</div>
                    </td>
                    <td className="px-4 py-3">{app.citizenName}</td>
                    <td className="px-4 py-3">
                      {app.reissueReason ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">{app.reissueReason}</span>
                      ) : <span className="text-gray-400 text-xs">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>{app.status}</span>
                      {app.isOverdue && <span className="ml-1 text-red-500 text-xs">{t('dashboard.overdue')}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {app.policeApproved ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">{t('status.approved')}</span>
                      ) : app.status === 'PoliceVerification' ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">{t('status.pending')}</span>
                      ) : <span className="text-gray-400 text-xs">-</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{app.currentStep || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">{t('common.pageOf', { current: page, total: totalPages })} ({totalCount} {t('common.total')})</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">{t('common.previous')}</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">{t('common.next')}</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
