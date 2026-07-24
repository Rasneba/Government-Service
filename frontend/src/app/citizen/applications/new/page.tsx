'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import type { ServiceType, ApiResponse } from '@/types'

export default function CitizenNewApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = Number(searchParams.get('serviceTypeId')) || 0
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [selectedId, setSelectedId] = useState(preselected)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [loading, setLoading] = useState(false)
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<ServiceType[]>>('/Services/types', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setServiceTypes(res.data.data))
      .finally(() => setLoadingServices(false))
  }, [router])

  const selected = serviceTypes.find(st => st.id === selectedId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !subject.trim()) return
    setLoading(true)
    try {
      const token = localStorage.getItem('citizenToken')
      await api.post('/Applications', { serviceTypeId: selectedId, subject, description, priority }, { headers: { Authorization: `Bearer ${token}` } })
      router.push('/citizen/applications')
    } catch (err) { alert('Failed to create application') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Application</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Service Type *</label>
          <select value={selectedId} onChange={e => setSelectedId(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" required>
            <option value={0}>Select a service</option>
            {serviceTypes.map(st => <option key={st.id} value={st.id}>{st.name} ({st.code}) - {st.fee > 0 ? `ETB ${st.fee}` : 'Free'}</option>)}
          </select>
        </div>
        {selected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <div className="font-medium">{selected.name}</div>
            <div className="text-gray-600 mt-1">{selected.description}</div>
            <div className="mt-2 text-gray-500">Fee: {selected.fee > 0 ? `ETB ${selected.fee}` : 'Free'} | Time: {selected.estimatedDays || 'Varies'} days</div>
            {selected.requiredDocuments && (
              <div className="mt-2"><span className="font-medium">Required:</span>{' '}
                {JSON.parse(selected.requiredDocuments).join(', ')}
              </div>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Subject *</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="Low">Low</option><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading || !selectedId} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Application'}</button>
          <button type="button" onClick={() => router.back()} className="border px-6 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  )
}
