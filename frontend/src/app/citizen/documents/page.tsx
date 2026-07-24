'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { ApplicationDocument, ApiResponse } from '@/types'

export default function CitizenDocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<ApplicationDocument[]>([])
  const [loading, setLoading] = useState(true)

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
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          <p>No documents uploaded yet.</p>
          <p className="text-sm mt-2">Documents are uploaded when you submit an application.</p>
          <Link href="/citizen/services" className="text-green-600 hover:underline text-sm mt-2 inline-block">Browse Services</Link>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium">File</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Application</th>
              <th className="text-left px-4 py-3 font-medium">Verified</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr></thead>
            <tbody className="divide-y">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{doc.fileName}</td>
                  <td className="px-4 py-3 text-gray-500">{doc.documentType}</td>
                  <td className="px-4 py-3 text-gray-500">{(doc as any).applicationNumber || '-'}</td>
                  <td className="px-4 py-3">{doc.isVerified ? <span className="text-green-600">✓ Verified</span> : <span className="text-gray-400">Pending</span>}</td>
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
