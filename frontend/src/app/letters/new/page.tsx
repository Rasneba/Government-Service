'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import { isAuthenticated, getStoredUser } from '@/lib/auth'
import api from '@/lib/api'
import { User, Department } from '@/types'
import { Loader2 } from 'lucide-react'

export default function NewLetterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    subject: '', body: '', priority: 'Normal', receiverId: '', receiverDepartmentId: '',
    citizenName: '', caseNumber: '', dueDate: '', isIncoming: false,
  })

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    setCurrentUser(getStoredUser())
    loadData()
  }, [router])

  async function loadData() {
    try {
      const [usersRes, deptsRes] = await Promise.all([api.get('/users?pageSize=100'), api.get('/departments')])
      setUsers(usersRes.data.data?.items || [])
      setDepartments(deptsRes.data.data || [])
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = { subject: form.subject, body: form.body, priority: form.priority, isIncoming: form.isIncoming }
      if (form.receiverId) payload.receiverId = parseInt(form.receiverId)
      if (form.receiverDepartmentId) payload.receiverDepartmentId = parseInt(form.receiverDepartmentId)
      if (form.citizenName) payload.citizenName = form.citizenName
      if (form.caseNumber) payload.caseNumber = form.caseNumber
      if (form.dueDate) payload.dueDate = form.dueDate
      const res = await api.post('/letters', payload)
      router.push(`/letters/${res.data.data.id}`)
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to create letter') } finally { setLoading(false) }
  }

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading...</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Letter</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" checked={!form.isIncoming} onChange={() => setForm({ ...form, isIncoming: false })} /> Outgoing</label>
            <label className="flex items-center gap-2"><input type="radio" checked={form.isIncoming} onChange={() => setForm({ ...form, isIncoming: true })} /> Incoming</label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Low">Low</option><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option>
            </select></div>
        </div>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Receiver</label>
            <select value={form.receiverId} onChange={(e) => setForm({ ...form, receiverId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Select user</option>
              {users.filter((u) => u.id !== currentUser?.id).map((u) => (<option key={u.id} value={u.id}>{u.fullName} ({u.departmentName || 'N/A'})</option>))}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={form.receiverDepartmentId} onChange={(e) => setForm({ ...form, receiverDepartmentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Select department</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select></div>
        </div>
        {(form.isIncoming || form.citizenName || form.caseNumber) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Citizen Name</label>
              <input type="text" value={form.citizenName} onChange={(e) => setForm({ ...form, citizenName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
              <input type="text" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 size={18} className="animate-spin" />} {loading ? 'Creating...' : 'Create Letter'}
          </button>
        </div>
      </form>
    </Layout>
  )
}
