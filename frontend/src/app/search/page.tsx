'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import PriorityBadge from '@/components/common/PriorityBadge'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { LetterListItem, PagedResult } from '@/types'
import { Search } from 'lucide-react'
import { useTranslation } from '@/lib/I18nContext'

export default function SearchPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [results, setResults] = useState<PagedResult<LetterListItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState({
    letterNumber: '', subject: '', citizenName: '', caseNumber: '', senderName: '', status: '', dateFrom: '', dateTo: '',
  })

  useEffect(() => { setMounted(true); if (!isAuthenticated()) { router.replace('/login') } }, [router])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const params: Record<string, string | number | boolean> = { page: 1, pageSize: 50 }
      Object.entries(form).forEach(([key, val]) => { if (val) params[key] = val })
      const res = await api.get('/letters', { params }); setResults(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'letterNumber', header: t('letters.letterNumber'), render: (item: LetterListItem) => <span className="font-mono text-xs">{item.letterNumber}</span> },
    { key: 'subject', header: t('letters.subject'), render: (item: LetterListItem) => <span className="font-medium">{item.subject}</span> },
    { key: 'sender', header: t('letters.sender'), render: (item: LetterListItem) => item.senderName },
    { key: 'priority', header: t('applications.priority'), render: (item: LetterListItem) => <PriorityBadge priority={item.priority} /> },
    { key: 'status', header: t('common.status'), render: (item: LetterListItem) => <StatusBadge status={item.status} /> },
    { key: 'date', header: t('common.date'), render: (item: LetterListItem) => new Date(item.createdAt).toLocaleDateString() },
  ]

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">{t('common.loading')}</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('nav.search')}</h1>
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input type="text" placeholder={t('letters.letterNumber')} value={form.letterNumber} onChange={(e) => setForm({ ...form, letterNumber: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder={t('letters.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder={t('applications.citizen')} value={form.citizenName} onChange={(e) => setForm({ ...form, citizenName: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Case Number" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder={t('letters.sender')} value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{t('common.all')}</option><option value="Draft">{t('status.draft')}</option><option value="Submitted">{t('status.submitted')}</option><option value="Approved">{t('status.approved')}</option><option value="Sent">Sent</option><option value="Received">Received</option><option value="Closed">Closed</option><option value="Rejected">{t('status.rejected')}</option>
          </select>
          <input type="date" value={form.dateFrom} onChange={(e) => setForm({ ...form, dateFrom: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="date" value={form.dateTo} onChange={(e) => setForm({ ...form, dateTo: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Search size={18} /> {t('common.search')}</button>
      </form>
      <DataTable columns={columns} data={results?.items || []} loading={loading} onRowClick={(item) => router.push(`/letters/${item.id}`)} />
    </Layout>
  )
}
