'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import StatusBadge from '@/components/common/StatusBadge'
import PriorityBadge from '@/components/common/PriorityBadge'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { Letter } from '@/types'
import { ArrowLeft, Send, CheckCircle, XCircle, MessageSquare } from 'lucide-react'

export default function LetterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [letter, setLetter] = useState<Letter | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadLetter()
  }, [router])

  async function loadLetter() {
    try {
      const res = await api.get(`/letters/${params.id}`)
      setLetter(res.data.data)
    } catch { router.push('/letters') } finally { setLoading(false) }
  }

  async function updateStatus(status: string) {
    try { await api.put(`/letters/${params.id}/status`, { status }); loadLetter() }
    catch (err: any) { alert(err.response?.data?.message || 'Failed to update status') }
  }

  async function addComment() {
    if (!comment.trim()) return
    try { await api.post(`/letters/${params.id}/comments`, { comment }); setComment(''); loadLetter() }
    catch (err: any) { alert(err.response?.data?.message || 'Failed to add comment') }
  }

  if (!mounted || loading) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading...</div></Layout>
  if (!letter) return <Layout><div className="text-red-500">Letter not found</div></Layout>

  const statusActions: Record<string, string[]> = {
    Draft: ['Submitted'], Submitted: ['Approved', 'Rejected'], Approved: ['Sent'],
    Sent: ['Received'], Received: ['Closed'], Closed: [], Rejected: [],
  }
  const availableActions = statusActions[letter.status] || []

  return (
    <Layout>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"><ArrowLeft size={18} /> Back</button>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between mb-4">
            <div><h1 className="text-xl font-bold text-gray-800">{letter.subject}</h1><p className="text-sm text-gray-500 font-mono mt-1">{letter.letterNumber}</p></div>
            <div className="flex gap-2"><PriorityBadge priority={letter.priority} /><StatusBadge status={letter.status} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">From:</span><p className="font-medium">{letter.senderName}</p>{letter.senderDepartment && <p className="text-xs text-gray-400">{letter.senderDepartment}</p>}</div>
            <div><span className="text-gray-500">To:</span><p className="font-medium">{letter.receiverName || 'N/A'}</p>{letter.receiverDepartment && <p className="text-xs text-gray-400">{letter.receiverDepartment}</p>}</div>
            <div><span className="text-gray-500">Created:</span><p className="font-medium">{new Date(letter.createdAt).toLocaleString()}</p></div>
            {letter.dueDate && <div><span className="text-gray-500">Due:</span><p className="font-medium">{new Date(letter.dueDate).toLocaleDateString()}</p></div>}
          </div>
          {letter.citizenName && <div className="mt-3 text-sm"><span className="text-gray-500">Citizen:</span> {letter.citizenName}{letter.caseNumber && <span className="ml-4"><span className="text-gray-500">Case:</span> {letter.caseNumber}</span>}</div>}
        </div>
        <div className="p-6 border-b"><h3 className="font-semibold mb-3">Letter Body</h3><div className="text-gray-700 whitespace-pre-wrap">{letter.body}</div></div>
        {availableActions.length > 0 && (
          <div className="p-6 border-b"><h3 className="font-semibold mb-3">Actions</h3><div className="flex gap-2 flex-wrap">
            {availableActions.map((action) => {
              const colors: Record<string, string> = { Submitted: 'bg-yellow-600 hover:bg-yellow-700', Approved: 'bg-green-600 hover:bg-green-700', Rejected: 'bg-red-600 hover:bg-red-700', Sent: 'bg-blue-600 hover:bg-blue-700', Received: 'bg-indigo-600 hover:bg-indigo-700', Closed: 'bg-gray-600 hover:bg-gray-700' }
              return (<button key={action} onClick={() => { if (action === 'Rejected') { const reason = prompt('Rejection reason:'); if (!reason) return } updateStatus(action) }} className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm ${colors[action] || 'bg-blue-600'}`}>{action}</button>)
            })}
          </div></div>
        )}
        {letter.movements.length > 0 && (
          <div className="p-6 border-b"><h3 className="font-semibold mb-3">Movement History</h3><div className="space-y-2">
            {letter.movements.map((m) => (<div key={m.id} className="flex items-start gap-3 text-sm"><div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" /><div><p><span className="font-medium">{m.fromUserName}</span>{m.action && <> - {m.action}</>}</p>{m.notes && <p className="text-gray-500 text-xs">{m.notes}</p>}<p className="text-gray-400 text-xs">{new Date(m.createdAt).toLocaleString()}</p></div></div>))}
          </div></div>
        )}
        <div className="p-6">
          <h3 className="font-semibold mb-3">Comments</h3>
          <div className="mb-4 space-y-3">
            {letter.comments.length === 0 ? <p className="text-gray-500 text-sm">No comments yet</p> : letter.comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-lg p-3"><div className="flex items-center gap-2 mb-1"><span className="font-medium text-sm">{c.userName}</span><span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span></div><p className="text-sm text-gray-700">{c.comment}</p></div>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={2} />
            <button onClick={addComment} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><MessageSquare size={16} /> Send</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
