'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout/Layout'
import api from '@/lib/api'
import type { ApplicationDetail, ApiResponse } from '@/types'

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

const stepStatusColors: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-500',
  InProgress: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    loadApplication()
  }, [id])

  const loadApplication = async () => {
    try {
      const res = await api.get<ApiResponse<ApplicationDetail>>(`/api/Applications/${id}`)
      setApplication(res.data.data)
    } catch (err) {
      console.error('Failed to load application', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdvanceStep = async () => {
    try {
      await api.put(`/api/Applications/${id}/advance`, { note: noteText || null })
      setNoteText('')
      loadApplication()
    } catch (err) {
      console.error('Failed to advance step', err)
      alert('Failed to advance step')
    }
  }

  const handleRejectStep = async () => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return
    try {
      await api.put(`/api/Applications/${id}/reject`, { note: reason })
      loadApplication()
    } catch (err) {
      console.error('Failed to reject step', err)
      alert('Failed to reject step')
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setAddingNote(true)
    try {
      await api.post(`/api/Applications/${id}/notes`, { note: noteText, isInternal: false })
      setNoteText('')
      loadApplication()
    } catch (err) {
      console.error('Failed to add note', err)
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) return <Layout><div className="p-6 text-center text-gray-500">Loading...</div></Layout>
  if (!application) return <Layout><div className="p-6 text-center text-gray-500">Application not found</div></Layout>

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/applications" className="hover:underline">Applications</Link>
          <span>/</span>
          <span>{application.applicationNumber}</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{application.applicationNumber}</h1>
            <p className="text-gray-500">{application.serviceName}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[application.status] || 'bg-gray-100'}`}>
            {application.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Application Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Citizen:</span> {application.citizenName}</div>
                <div><span className="text-gray-500">Phone:</span> {application.citizenPhone}</div>
                <div><span className="text-gray-500">Priority:</span> {application.priority}</div>
                <div><span className="text-gray-500">Fee:</span> ETB {application.feeAmount.toLocaleString()} {application.feePaid ? '(Paid)' : '(Unpaid)'}</div>
                <div className="col-span-2"><span className="text-gray-500">Subject:</span> {application.subject}</div>
                {application.description && <div className="col-span-2"><span className="text-gray-500">Description:</span> {application.description}</div>}
                {application.rejectionReason && <div className="col-span-2 text-red-600"><span className="text-gray-500">Rejection Reason:</span> {application.rejectionReason}</div>}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Workflow Progress</h2>
              <div className="space-y-3">
                {application.workflowSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-gray-100">
                      {step.stepOrder}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{step.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${stepStatusColors[step.executionStatus] || 'bg-gray-100'}`}>
                          {step.executionStatus}
                        </span>
                        {step.isAutoStep && <span className="text-xs text-gray-400">(auto)</span>}
                      </div>
                      {step.assignedTo && <div className="text-xs text-gray-500">Assigned to: {step.assignedTo}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {application.notes.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h2 className="font-semibold mb-4">Notes</h2>
                <div className="space-y-3">
                  {application.notes.map((note) => (
                    <div key={note.id} className={`p-3 rounded text-sm ${note.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{note.authorName}</span>
                        <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                        {note.isInternal && <span className="text-xs text-yellow-600">Internal</span>}
                      </div>
                      <div className="text-gray-600">{note.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-3">Add Note</h2>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
                rows={3}
                placeholder="Type a note..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || addingNote}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Note
                </button>
                {application.status !== 'Completed' && application.status !== 'Cancelled' && application.status !== 'Rejected' && (
                  <>
                    <button
                      onClick={handleAdvanceStep}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Advance Step
                    </button>
                    <button
                      onClick={handleRejectStep}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                {application.stepHistory.map((h) => (
                  <div key={h.id} className="text-sm border-l-2 border-gray-200 pl-4">
                    <div className="font-medium">{h.stepName}</div>
                    <div className={`text-xs ${stepStatusColors[h.status] || ''}`}>{h.status}</div>
                    {h.assignedTo && <div className="text-xs text-gray-500">{h.assignedTo}</div>}
                    {h.startedAt && <div className="text-xs text-gray-400">Started: {new Date(h.startedAt).toLocaleString()}</div>}
                    {h.completedAt && <div className="text-xs text-gray-400">Completed: {new Date(h.completedAt).toLocaleString()}</div>}
                    {h.notes && <div className="text-xs text-gray-500 mt-1">{h.notes}</div>}
                  </div>
                ))}
              </div>
            </div>

            {application.documents.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h2 className="font-semibold mb-4">Documents</h2>
                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{doc.fileName}</div>
                        <div className="text-xs text-gray-400">{doc.documentType} v{doc.version}</div>
                      </div>
                      {doc.isVerified && <span className="text-green-600 text-xs">Verified</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
