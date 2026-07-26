'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { AppointmentDto, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700', Confirmed: 'bg-green-100 text-green-700',
  Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700',
  NoShow: 'bg-gray-100 text-gray-700',
}

export default function CitizenAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<AppointmentDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<{timeSlot: string; isAvailable: boolean}[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    loadAppointments(token)
  }, [router])

  const loadAppointments = async (token: string) => {
    try {
      const res = await api.get<ApiResponse<AppointmentDto[]>>('/Appointments', { headers: { Authorization: `Bearer ${token}` } })
      setAppointments(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const loadSlots = async (d: string) => {
    const token = localStorage.getItem('citizenToken')
    if (!token || !d) return
    try {
      const res = await api.get<ApiResponse<{timeSlot: string; isAvailable: boolean}[]>>(`/Appointments/slots?date=${d}`, { headers: { Authorization: `Bearer ${token}` } })
      setSlots(res.data.data)
    } catch {}
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('citizenToken')
      await api.post('/Appointments', { serviceName, appointmentDate: date, timeSlot, notes }, { headers: { Authorization: `Bearer ${token}` } })
      setShowForm(false); setServiceName(''); setDate(''); setTimeSlot(''); setNotes('')
      loadAppointments(token!)
    } catch { alert('Failed to book appointment') } finally { setSubmitting(false) }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this appointment?')) return
    const token = localStorage.getItem('citizenToken')
    await api.put(`/Appointments/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
    loadAppointments(token!)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('citizen.appointments')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">{showForm ? t('common.cancel') : t('citizen.appointments')}</button>
      </div>

      {showForm && (
        <form onSubmit={handleBook} className="bg-white border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">{t('applications.serviceType')} *</label><input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required /></div>
            <div><label className="block text-sm font-medium mb-1">{t('common.date')} *</label><input type="date" value={date} onChange={e => { setDate(e.target.value); loadSlots(e.target.value) }} className="w-full border rounded-lg px-3 py-2 text-sm" required min={new Date().toISOString().split('T')[0]} /></div>
          </div>
          {slots.length > 0 && (
            <div><label className="block text-sm font-medium mb-2">{t('common.status')}</label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map(s => (
                  <button key={s.timeSlot} type="button" disabled={!s.isAvailable} onClick={() => setTimeSlot(s.timeSlot)}
                    className={`p-2 rounded border text-sm ${timeSlot === s.timeSlot ? 'bg-green-100 border-green-500' : s.isAvailable ? 'hover:bg-gray-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}>{s.timeSlot}</button>
                ))}
              </div>
            </div>
          )}
          <div><label className="block text-sm font-medium mb-1">{t('applications.notes')}</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} /></div>
          <button type="submit" disabled={submitting || !timeSlot} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{submitting ? t('common.loading') : t('common.confirm')}</button>
        </form>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">{t('common.loading')}</div> : appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">{t('common.noData')}</div>
      ) : (
        <div className="space-y-3">
          {appointments.map(a => (
            <div key={a.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.serviceName}</div>
                <div className="text-sm text-gray-500">{new Date(a.appointmentDate).toLocaleDateString()} | {a.timeSlot}</div>
                {a.departmentName && <div className="text-xs text-gray-400">{a.departmentName}</div>}
                {a.notes && <div className="text-xs text-gray-400 mt-1">{a.notes}</div>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[a.status] || 'bg-gray-100'}`}>{a.status}</span>
                {a.status === 'Scheduled' && <button onClick={() => handleCancel(a.id)} className="text-red-500 text-sm hover:underline">{t('common.cancel')}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
