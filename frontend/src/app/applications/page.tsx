'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import api from '@/lib/api'
import type { ApplicationListItem, PagedResult, ApiResponse } from '@/types'

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
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const pageSize = 20

  useEffect(() => {
    loadApplications()
  }, [page, statusFilter])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() })
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get<ApiResponse<PagedResult<ApplicationListItem>>>(`/api/Applications?${params}`)
      setApplications(res.data.data.items)
      setTotalCount(res.data.data.totalCount)
    } catch (err) {
      console.error('Failed to load applications', err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Applications</h1>
          <Link
            href="/applications/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            New Application
          </Link>
        </div>

        <div className="mb-4 flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="DocumentVerification">Document Verification</option>
            <option value="UnderReview">Under Review</option>
            <option value="PoliceVerification">Police Verification</option>
            <option value="SupervisorApproval">Supervisor Approval</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No applications found</div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Application #</th>
                  <th className="text-left px-4 py-3 font-medium">Service</th>
                  <th className="text-left px-4 py-3 font-medium">Citizen</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Current Step</th>
                  <th className="text-left px-4 py-3 font-medium">Priority</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/applications/${app.id}`} className="text-blue-600 hover:underline font-medium">
                        {app.applicationNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{app.serviceName}</td>
                    <td className="px-4 py-3">{app.citizenName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>
                        {app.status}
                      </span>
                      {app.isOverdue && <span className="ml-1 text-red-500 text-xs">Overdue</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{app.currentStep || '-'}</td>
                    <td className="px-4 py-3">{app.priority}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">Page {page} of {totalPages} ({totalCount} total)</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
