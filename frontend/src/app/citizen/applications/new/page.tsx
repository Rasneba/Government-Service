'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import type { ServiceType, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

function CitizenNewApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = Number(searchParams.get('serviceTypeId')) || 0
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [selectedId, setSelectedId] = useState(preselected)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [originalCertNumber, setOriginalCertNumber] = useState('')
  const [reissueReason, setReissueReason] = useState('Lost')
  const [certDetails, setCertDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingServices, setLoadingServices] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<ServiceType[]>>('/Services/types', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setServiceTypes(res.data.data))
      .finally(() => setLoadingServices(false))
  }, [router])

  const selected = serviceTypes.find(st => st.id === selectedId)
  const isReissue = true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !subject.trim()) return
    setLoading(true)
    try {
      const token = localStorage.getItem('citizenToken')
      const payload: any = { serviceTypeId: selectedId, subject, description, priority }
      if (isReissue) {
        payload.originalCertificateNumber = originalCertNumber
        payload.reissueReason = reissueReason
        payload.originalCertificateDetails = certDetails
      }
      await api.post('/Applications', payload, { headers: { Authorization: `Bearer ${token}` } })
      router.push('/citizen/applications')
    } catch (err) { alert('Failed to create application') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t('citizen.reissueTitle')}</h1>
      <p className="text-sm text-slate-500 mb-6">{t('citizen.reissueSubtitle')}</p>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">{t('applications.serviceType')} {t('common.required')}</label>
          <select value={selectedId} onChange={e => setSelectedId(Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" required>
            <option value={0}>{t('applications.selectService')}</option>
            {serviceTypes.map(st => (
              <option key={st.id} value={st.id}>{st.name} ({st.code}) — {st.fee > 0 ? `ETB ${st.fee}` : 'Free'}</option>
            ))}
          </select>
        </div>

        {selected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <div className="font-medium">{selected.name}</div>
            <div className="text-gray-600 mt-1">{selected.description}</div>
            <div className="mt-2 text-gray-500">{t('services.fee')}: {selected.fee > 0 ? `ETB ${selected.fee}` : 'Free'} | {t('services.estimatedDays')}: {selected.estimatedDays || 'Varies'} days</div>
            {selected.requiresPoliceVerification && (
              <div className="mt-2 text-amber-600 font-medium">{t('services.policeVerification')}</div>
            )}
            {selected.requiredDocuments && (
              <div className="mt-2"><span className="font-medium">{t('services.evidence')}:</span>
                <ul className="mt-1 list-disc list-inside text-gray-600">
                  {JSON.parse(selected.requiredDocuments).map((doc: string, i: number) => <li key={i}>{doc}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {isReissue && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-amber-800">{t('citizen.reissueTitle')}</h3>
            <div>
              <label className="block text-sm font-medium mb-1">{t('applications.reissueReason')} {t('common.required')}</label>
              <select value={reissueReason} onChange={e => setReissueReason(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required>
                <option value="Lost">Certificate Lost</option>
                <option value="Damaged">Certificate Damaged</option>
                <option value="Destroyed">Certificate Destroyed</option>
                <option value="Stolen">Certificate Stolen</option>
                <option value="Name Change">Name Change</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('applications.originalCertNumber')}</label>
              <input type="text" value={originalCertNumber} onChange={e => setOriginalCertNumber(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. BC-20200101-0001" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('applications.originalCertDetails')} {t('common.required')}</label>
              <textarea value={certDetails} onChange={e => setCertDetails(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Describe when and where the certificate was lost/damaged, any supporting information..." required />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">{t('applications.subject')} {t('common.required')}</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" required placeholder={t('applications.subject')} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('applications.notes')}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} placeholder={t('applications.notes')} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('applications.priority')}</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="Low">Low</option><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading || !selectedId} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
            {loading ? t('applications.creating') : t('citizen.submitRequest')}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-6 py-2 rounded-lg text-sm hover:bg-gray-50">{t('common.cancel')}</button>
        </div>
      </form>
    </div>
  )
}

export default function CitizenNewApplicationPage() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">{t('common.loading')}</div>}>
      <CitizenNewApplicationForm />
    </Suspense>
  )
}
