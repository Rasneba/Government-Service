'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { ApplicationListItem, PagedResult, ApiResponse } from '@/types'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700', Submitted: 'bg-blue-100 text-blue-700',
  UnderReview: 'bg-indigo-100 text-indigo-700', DocumentVerification: 'bg-yellow-100 text-yellow-700',
  PaymentPending: 'bg-amber-100 text-amber-700', PoliceVerification: 'bg-orange-100 text-orange-700',
  SupervisorApproval: 'bg-purple-100 text-purple-700', Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700', Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700', Archived: 'bg-slate-100 text-slate-700',
}

export default function CitizenApplicationsPage() {
  const router = useRouter()
  const [apps, setApps] = useState<ApplicationListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<PagedResult<ApplicationListItem>>>('/Applications?pageSize=50', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApps(res.data.data.items))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Track your certificate reissue and service applications</p>
        </div>
        <Link href="/citizen/applications/new" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">New Reissue Request</Link>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : apps.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          <p className="mb-2">No applications yet</p>
          <Link href="/citizen/applications/new" className="text-green-600 hover:underline">Apply for certificate reissue</Link>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium">Application #</th>
              <th className="text-left px-4 py-3 font-medium">Service</th>
              <th className="text-left px-4 py-3 font-medium">Reason</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Step</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr></thead>
            <tbody className="divide-y">
              {apps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/citizen/applications/${app.id}`)}>
                  <td className="px-4 py-3 font-medium text-blue-600">{app.applicationNumber}</td>
                  <td className="px-4 py-3">{app.serviceName}</td>
                  <td className="px-4 py-3">
                    {app.reissueReason ? <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">{app.reissueReason}</span> : <span className="text-gray-400 text-xs">-</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>{app.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{app.currentStep || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
