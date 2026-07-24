'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { Citizen, ApiResponse } from '@/types'

export default function CitizenProfilePage() {
  const router = useRouter()
  const [citizen, setCitizen] = useState<Citizen | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', gender: '', address: '' })
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPw, setChangingPw] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<Citizen>>('/Citizens/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setCitizen(res.data.data)
        setForm({ fullName: res.data.data.fullName, email: res.data.data.email || '', gender: res.data.data.gender || '', address: res.data.data.address || '' })
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      const token = localStorage.getItem('citizenToken')
      const res = await api.put<ApiResponse<Citizen>>('/Citizens/me', form, { headers: { Authorization: `Bearer ${token}` } })
      setCitizen(res.data.data); setEditing(false); setMsg('Profile updated')
    } catch { setMsg('Failed to update profile') } finally { setSaving(false) }
  }

  const handlePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setMsg('Passwords do not match'); return }
    setChangingPw(true); setMsg('')
    try {
      const token = localStorage.getItem('citizenToken')
      await api.put('/Citizens/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMsg('Password changed')
    } catch { setMsg('Failed to change password') } finally { setChangingPw(false) }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>
  if (!citizen) return <div className="text-center py-20 text-gray-500">Not found</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {msg && <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg}</div>}

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Personal Information</h2>
          {!editing && <button onClick={() => setEditing(true)} className="text-green-600 text-sm hover:underline">Edit</button>}
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Full Name</label>
            {editing ? <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /> : <div className="text-sm">{citizen.fullName}</div>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Phone Number</label><div className="text-sm text-gray-500">{citizen.phoneNumber}</div></div>
          <div><label className="block text-sm font-medium mb-1">Email</label>
            {editing ? <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /> : <div className="text-sm">{citizen.email || 'Not provided'}</div>}
          </div>
          <div><label className="block text-sm font-medium mb-1">National ID</label><div className="text-sm text-gray-500">{citizen.nationalId || 'Not provided'}</div></div>
          <div><label className="block text-sm font-medium mb-1">Gender</label>
            {editing ? <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select> : <div className="text-sm">{citizen.gender || 'Not provided'}</div>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Address</label>
            {editing ? <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /> : <div className="text-sm">{citizen.address || 'Not provided'}</div>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Verification Status</label>
            <div className={`text-sm font-medium ${citizen.isVerified ? 'text-green-600' : 'text-amber-600'}`}>{citizen.isVerified ? '✓ Verified' : 'Pending Verification'}</div>
          </div>
        </div>
        {editing && (
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
            <button onClick={() => setEditing(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium mb-1">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" minLength={6} /></div>
          <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <button onClick={handlePassword} disabled={changingPw || !pwForm.currentPassword || !pwForm.newPassword} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{changingPw ? 'Changing...' : 'Change Password'}</button>
        </div>
      </div>
    </div>
  )
}
