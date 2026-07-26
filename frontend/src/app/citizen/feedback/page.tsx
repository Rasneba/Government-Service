'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { FeedbackDto, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

export default function CitizenFeedbackPage() {
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState<FeedbackDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState('ServiceRating')
  const [rating, setRating] = useState(5)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<FeedbackDto[]>>('/Feedbacks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFeedbackList(res.data.data))
      .finally(() => setLoading(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('citizenToken')
      await api.post('/Feedbacks', { type, rating, subject, message }, { headers: { Authorization: `Bearer ${token}` } })
      setShowForm(false); setSubject(''); setMessage(''); setRating(5)
      const res = await api.get<ApiResponse<FeedbackDto[]>>('/Feedbacks', { headers: { Authorization: `Bearer ${token}` } })
      setFeedbackList(res.data.data)
    } catch { alert('Failed to submit feedback') } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('citizen.feedback')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">{showForm ? t('common.cancel') : t('citizen.feedback')}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">{t('citizen.feedback')}</label><select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="ServiceRating">Service Rating</option><option value="WebsiteExperience">Website Experience</option><option value="StaffPerformance">Staff Performance</option><option value="Suggestion">Suggestion</option>
            </select></div>
            <div><label className="block text-sm font-medium mb-1">{t('common.status')} *</label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
            </div>
          </div>
          <div><label className="block text-sm font-medium mb-1">{t('applications.subject')}</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">{t('applications.description')}</label><textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={4} /></div>
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">{submitting ? t('applications.creating') : t('citizen.feedback')}</button>
        </form>
      )}

      {loading ? <div className="text-center py-12 text-gray-500">{t('common.loading')}</div> : feedbackList.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">{t('common.noData')}</div>
      ) : (
        <div className="space-y-3">
          {feedbackList.map(f => (
            <div key={f.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{f.subject || f.type}</span>
                <div className="text-yellow-400">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
              </div>
              {f.message && <p className="text-sm text-gray-600">{f.message}</p>}
              <div className="text-xs text-gray-400 mt-2">{f.type} | {new Date(f.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
