'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import type { ApplicationDetail, ApiResponse, WorkflowStepDisplay } from '@/types'

export default function PoliceApplicationReviewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewNotes, setReviewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('policeToken')}` })

  useEffect(() => {
    if (!localStorage.getItem('policeToken')) { router.replace('/police/login'); return }
    api.get<ApiResponse<ApplicationDetail>>(`/Police/${id}`, { headers: getHeaders() })
      .then(res => setApp(res.data.data))
      .finally(() => setLoading(false))
  }, [id, router])

  const handleReview = async (approved: boolean) => {
    if (!reviewNotes.trim()) { alert('Please enter verification notes'); return }
    setSubmitting(true)
    try {
      await api.post(`/Police/${id}/review`, { approved, notes: reviewNotes }, { headers: getHeaders() })
      setMessage(approved ? 'Application approved successfully!' : 'Application rejected.')
      setTimeout(() => router.push('/police/dashboard'), 1500)
    } catch (err) { alert('Failed to submit review') } finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-slate-500">Loading...</div>
  if (!app) return <div className="flex items-center justify-center min-h-screen text-red-500">Application not found</div>

  const currentStepIdx = app.workflowSteps.findIndex(s => s.executionStatus === 'InProgress')
  const isPoliceStep = app.currentStepName === 'Police Verification'

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/police/dashboard')} className="text-slate-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">Review Application</h1>
        </div>
      </nav>

      {message && (
        <div className="max-w-4xl mx-auto px-6 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">{message}</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{app.serviceName}</h2>
              <p className="text-sm text-slate-500 font-mono mt-1">{app.applicationNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              app.status === 'PoliceVerification' ? 'bg-amber-100 text-amber-700' :
              app.status === 'Completed' ? 'bg-green-100 text-green-700' :
              app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
              'bg-slate-100 text-slate-700'
            }`}>{app.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Citizen:</span> <span className="font-medium">{app.citizenName}</span></div>
            <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{app.citizenPhone}</span></div>
            <div><span className="text-slate-500">Priority:</span> <span className="font-medium">{app.priority}</span></div>
            <div><span className="text-slate-500">Fee:</span> <span className="font-medium">ETB {app.feeAmount}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Reissue Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Reissue Reason:</span><span className="font-medium text-amber-600">{app.reissueReason || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Original Cert Number:</span><span className="font-mono font-medium">{app.originalCertificateNumber || 'N/A'}</span></div>
                {app.originalCertificateDetails && (
                  <div><span className="text-slate-500">Details:</span><p className="mt-1 text-slate-700 bg-slate-50 p-3 rounded">{app.originalCertificateDetails}</p></div>
                )}
                <div className="flex justify-between"><span className="text-slate-500">Submitted:</span><span>{new Date(app.createdAt).toLocaleDateString()}</span></div>
                {app.dueDate && <div className="flex justify-between"><span className="text-slate-500">Due Date:</span><span>{new Date(app.dueDate).toLocaleDateString()}</span></div>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Subject & Description</h3>
              <p className="text-sm font-medium">{app.subject}</p>
              {app.description && <p className="text-sm text-slate-600 mt-2">{app.description}</p>}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Uploaded Documents</h3>
              {app.documents.length === 0 ? (
                <p className="text-sm text-slate-400">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {app.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{doc.fileName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${doc.isVerified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Workflow Progress</h3>
              <div className="space-y-3">
                {app.workflowSteps.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      step.executionStatus === 'Completed' ? 'bg-green-500 text-white' :
                      step.executionStatus === 'InProgress' ? 'bg-blue-500 text-white' :
                      step.executionStatus === 'Rejected' ? 'bg-red-500 text-white' :
                      'bg-slate-200 text-slate-500'
                    }`}>{idx + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{step.name}</div>
                      <div className="text-xs text-slate-400">{step.description}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      step.executionStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                      step.executionStatus === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                      step.executionStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{step.executionStatus}</span>
                  </div>
                ))}
              </div>
            </div>

            {isPoliceStep && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Police Verification Review</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Verification Notes *</label>
                  <textarea
                    value={reviewNotes} onChange={e => setReviewNotes(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    rows={4} required placeholder="Enter your verification findings, observations, and decision rationale..."
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleReview(true)} disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Approve & Forward'}
                  </button>
                  <button
                    onClick={() => handleReview(false)} disabled={submitting}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            )}

            {!isPoliceStep && app.status !== 'Completed' && app.status !== 'Rejected' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <p className="text-sm text-amber-700">This application is not currently at the Police Verification step.</p>
                <p className="text-xs text-amber-500 mt-1">Current step: {app.currentStepName || 'N/A'}</p>
              </div>
            )}

            {(app.status === 'Completed' || app.status === 'Rejected') && (
              <div className={`rounded-xl p-6 text-center ${
                app.status === 'Completed' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${app.status === 'Completed' ? 'text-green-700' : 'text-red-700'}`}>
                  This application has been {app.status.toLowerCase()}
                </p>
                {app.rejectionReason && <p className="text-xs text-red-500 mt-1">Reason: {app.rejectionReason}</p>}
              </div>
            )}

            <button onClick={() => router.push('/police/dashboard')} className="w-full border border-slate-300 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
