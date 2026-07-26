'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { ApplicationDocument, ApiResponse } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

export default function CitizenDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<ApplicationDocument[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    api.get<ApiResponse<any>>('/Applications?pageSize=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const apps = res.data.data.items
        const allDocs: ApplicationDocument[] = []
        for (const app of apps) {
          try {
            const detail = await api.get<ApiResponse<any>>(`/Applications/${app.id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (detail.data.data.documents) allDocs.push(...detail.data.data.documents.map((d: any) => ({ ...d, applicationNumber: app.applicationNumber })))
          } catch {}
        }
        setDocuments(allDocs)
      })
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('citizen.myDocuments')}</h1>
      {loading ? <div className="text-center py-12 text-gray-500">{t('common.loading')}</div> : documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          <p>{t('common.noData')}</p>
          <p className="text-sm mt-2">{t('citizen.myDocuments')}</p>
          <Link href="/citizen/services" className="text-green-600 hover:underline text-sm mt-2 inline-block">{t('citizen.applyService')}</Link>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium">File</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">{t('applications.title')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('status.approved')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('common.date')}</th>
            </tr></thead>
            <tbody className="divide-y">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{doc.fileName}</td>
                  <td className="px-4 py-3 text-gray-500">{doc.documentType}</td>
                  <td className="px-4 py-3 text-gray-500">{(doc as any).applicationNumber || '-'}</td>
                  <td className="px-4 py-3">{doc.isVerified ? <span className="text-green-600">✓ {t('status.approved')}</span> : <span className="text-gray-400">{t('status.pending')}</span>}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
