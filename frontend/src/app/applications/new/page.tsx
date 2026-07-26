'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import api from '@/lib/api'
import type { ServiceType, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

function NewApplicationForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedServiceTypeId = searchParams.get('serviceTypeId')

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<number>(Number(preselectedServiceTypeId) || 0)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [loading, setLoading] = useState(false)
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    loadServiceTypes()
  }, [])

  const loadServiceTypes = async () => {
    try {
      const res = await api.get<ApiResponse<ServiceType[]>>('/Services/types')
      setServiceTypes(res.data.data)
    } catch (err) {
      console.error('Failed to load service types', err)
    } finally {
      setLoadingServices(false)
    }
  }

  const selectedService = serviceTypes.find(st => st.id === selectedServiceTypeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedServiceTypeId || !subject.trim()) return

    setLoading(true)
    try {
      await api.post('/Applications', {
        serviceTypeId: selectedServiceTypeId,
        subject,
        description,
        priority,
      })
      router.push('/applications')
    } catch (err) {
      console.error('Failed to create application', err)
      alert(t('applications.createFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('applications.newApplication')}</h1>

        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t('applications.serviceType')} *</label>
            {loadingServices ? (
              <div className="text-sm text-gray-500">{t('common.loading')}</div>
            ) : (
              <select
                value={selectedServiceTypeId}
                onChange={(e) => setSelectedServiceTypeId(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value={0}>{t('applications.selectService')}</option>
                {serviceTypes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.code}) - {st.fee > 0 ? `ETB ${st.fee}` : 'Free'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="font-medium mb-2">{selectedService.name}</div>
              <div className="text-gray-600 mb-2">{selectedService.description}</div>
              <div className="space-y-1 text-gray-500">
                <div>{t('services.estimatedDays')}: {selectedService.estimatedDays || 'Varies'}</div>
                <div>{t('services.fee')}: {selectedService.fee > 0 ? `ETB ${selectedService.fee.toLocaleString()}` : 'Free'}</div>
                {selectedService.requiresPoliceVerification && (
                  <div className="text-amber-600">{t('services.policeVerification')}</div>
                )}
              </div>
              {selectedService.requiredDocuments && (
                <div className="mt-3">
                  <div className="font-medium text-gray-700 mb-1">{t('services.evidence')}:</div>
                  <ul className="list-disc list-inside text-gray-500">
                    {JSON.parse(selectedService.requiredDocuments).map((doc: string, i: number) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">{t('applications.subject')} *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Brief description of your application"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('applications.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={4}
              placeholder="Detailed description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('applications.priority')}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="Low">{t('priority.low')}</option>
              <option value="Normal">{t('priority.normal')}</option>
              <option value="High">{t('priority.high')}</option>
              <option value="Urgent">{t('priority.urgent')}</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !selectedServiceTypeId || !subject.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? t('applications.creating') : t('common.submit')}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

function NewApplicationFallback() {
  const { t } = useTranslation()
  return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<NewApplicationFallback />}>
      <NewApplicationForm />
    </Suspense>
  )
}
