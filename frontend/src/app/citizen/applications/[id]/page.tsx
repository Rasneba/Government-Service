'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { ApplicationDetail, ApiResponse } from '@/types'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700', Submitted: 'bg-blue-100 text-blue-700',
  UnderReview: 'bg-indigo-100 text-indigo-700', DocumentVerification: 'bg-yellow-100 text-yellow-700',
  PoliceVerification: 'bg-orange-100 text-orange-700', SupervisorApproval: 'bg-purple-100 text-purple-700',
  Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700',
  Completed: 'bg-emerald-100 text-emerald-700', Cancelled: 'bg-red-100 text-red-700',
}

export default function CitizenApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<ApplicationDetail>>(`/Applications/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApp(res.data.data))
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>
  if (!app) return <div className="text-center py-20 text-gray-500">Application not found</div>

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/citizen/applications" className="hover:underline">Applications</Link><span>/</span><span>{app.applicationNumber}</span>
      </div>
      <div className="flex items-start justify-between mb-6">
        <div><h1 className="text-2xl font-bold">{app.applicationNumber}</h1><p className="text-gray-500">{app.serviceName}</p></div>
        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>{app.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Subject:</span> {app.subject}</div>
              <div><span className="text-gray-500">Priority:</span> {app.priority}</div>
              <div><span className="text-gray-500">Fee:</span> ETB {app.feeAmount} {app.feePaid ? '(Paid)' : '(Pending)'}</div>
              <div><span className="text-gray-500">Created:</span> {new Date(app.createdAt).toLocaleDateString()}</div>
              {app.description && <div className="col-span-2"><span className="text-gray-500">Description:</span> {app.description}</div>}
              {app.rejectionReason && <div className="col-span-2 text-red-600"><span className="text-gray-500">Rejection:</span> {app.rejectionReason}</div>}
            </div>
          </div>

          {(app.reissueReason || app.originalCertificateNumber) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="font-semibold text-amber-800 mb-3">Certificate Reissue Details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Reason:</span> <span className="font-medium text-amber-700">{app.reissueReason}</span></div>
                <div><span className="text-gray-500">Original Cert #:</span> <span className="font-mono">{app.originalCertificateNumber || 'N/A'}</span></div>
                {app.originalCertificateDetails && <div className="col-span-2"><span className="text-gray-500">Details:</span> {app.originalCertificateDetails}</div>}
              </div>
              {app.policeVerifiedAt && (
                <div className="mt-3 pt-3 border-t border-amber-200 text-sm">
                  <div className={`font-medium ${app.policeApproved ? 'text-green-700' : 'text-red-700'}`}>
                    Police Verification: {app.policeApproved ? 'Approved' : 'Rejected'}
                  </div>
                  {app.policeVerificationNotes && <p className="text-gray-600 mt-1 text-xs">{app.policeVerificationNotes}</p>}
                </div>
              )}
            </div>
          )}

          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Workflow Progress</h2>
            <div className="space-y-3">
              {app.workflowSteps.map(step => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.executionStatus === 'Completed' ? 'bg-green-500 text-white' :
                    step.executionStatus === 'InProgress' ? 'bg-blue-500 text-white' :
                    step.executionStatus === 'Rejected' ? 'bg-red-500 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>{step.executionStatus === 'Completed' ? '✓' : step.stepOrder}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{step.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        step.executionStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                        step.executionStatus === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                        step.executionStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{step.executionStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {app.documents.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-3">Uploaded Documents</h2>
              <div className="space-y-2">
                {app.documents.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div><div className="font-medium">{d.fileName}</div><div className="text-xs text-gray-400">{d.documentType}</div></div>
                    {d.isVerified && <span className="text-green-600 text-xs">Verified</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Timeline</h2>
            <div className="space-y-4">
              {app.stepHistory.map(h => (
                <div key={h.id} className="text-sm border-l-2 border-gray-200 pl-4">
                  <div className="font-medium">{h.stepName}</div>
                  <div className={`text-xs ${
                    h.status === 'Completed' ? 'text-green-600' : h.status === 'InProgress' ? 'text-blue-600' :
                    h.status === 'Rejected' ? 'text-red-600' : 'text-gray-500'
                  }`}>{h.status}</div>
                  {h.assignedTo && <div className="text-xs text-gray-500">{h.assignedTo}</div>}
                  {h.startedAt && <div className="text-xs text-gray-400">Started: {new Date(h.startedAt).toLocaleString()}</div>}
                  {h.completedAt && <div className="text-xs text-gray-400">Completed: {new Date(h.completedAt).toLocaleString()}</div>}
                  {h.notes && <div className="text-xs text-gray-500 mt-1">{h.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
