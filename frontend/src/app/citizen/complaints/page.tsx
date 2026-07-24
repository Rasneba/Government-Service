'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { ComplaintDto, ApiResponse } from '@/types'

const statusColors: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700', InProgress: 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700', Closed: 'bg-gray-100 text-gray-700',
  Reopened: 'bg-orange-100 text-orange-700',
}

export default function CitizenComplaintsPage() {
  const router = useRouter()
  const [complaints, setComplaints] = useState<ComplaintDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [priority, setPriority] = useState('Normal')
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    loadComplaints(token)
  }, [router])

  const loadComplaints = async (token: string) => {
    try {
      const res = await api.get<ApiResponse<ComplaintDto[]>>('/Complaints', { headers: { Authorization: `Bearer ${token}` } })
      setComplaints(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('citizenToken')
      await api.post('/Complaints', { subject, description, category, priority }, { headers: { Authorization: `Bearer ${token}` } })
      setShowForm(false); setSubject(''); setDescription('')
      loadComplaints(token!)
    } catch { alert('Failed to submit complaint') } finally { setSubmitting(false) }
  }

  const handleComment = async (complaintId: number) => {
    if (!commentText.trim()) return
    const token = localStorage.getItem('citizenToken')
    await api.post(`/Complaints/${complaintId}/comments`, { comment: commentText }, { headers: { Authorization: `Bearer ${token}` } })
    setCommentText('')
    loadComplaints(token!)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">{showForm ? 'Cancel' : 'New Complaint'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Subject *</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>General</option><option>Service Quality</option><option>Staff Conduct</option><option>Delay</option><option>Corruption</option><option>Other</option>
              </select></div>
              <div><label className="block text-sm font-medium mb-1">Priority</label><select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option>Low</option><option>Normal</option><option>High</option><option>Urgent</option>
              </select></div>
            </div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={4} required /></div>
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Complaint'}</button>
        </form>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : complaints.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">No complaints submitted</div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-white border rounded-lg">
              <div className="p-4 flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                <div>
                  <div className="font-medium">{c.subject}</div>
                  <div className="text-sm text-gray-500">{c.category} | {new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[c.status] || 'bg-gray-100'}`}>{c.status}</span>
              </div>
              {expandedId === c.id && (
                <div className="border-t p-4 space-y-4">
                  <div className="text-sm text-gray-600">{c.description}</div>
                  {c.resolution && <div className="bg-green-50 p-3 rounded text-sm"><span className="font-medium">Resolution:</span> {c.resolution}</div>}
                  {c.comments && c.comments.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Comments</div>
                      {c.comments.map(cm => (
                        <div key={cm.id} className={`p-2 rounded text-sm ${cm.isStaff ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <span className="font-medium">{cm.authorName}</span>: {cm.comment}
                          <span className="text-xs text-gray-400 ml-2">{new Date(cm.createdAt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                    <button onClick={() => handleComment(c.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Send</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
