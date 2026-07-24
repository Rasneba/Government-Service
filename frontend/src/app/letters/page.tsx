'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/common/StatusBadge'
import PriorityBadge from '@/components/common/PriorityBadge'
import Pagination from '@/components/common/Pagination'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { LetterListItem, PagedResult } from '@/types'
import { Plus } from 'lucide-react'

export default function LettersPage() {
  const router = useRouter()
  const [data, setData] = useState<PagedResult<LetterListItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadLetters()
  }, [page, filter, router])

  async function loadLetters() {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, pageSize: 20 }
      if (filter) params.status = filter
      const res = await api.get('/letters', { params })
      setData(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'letterNumber', header: 'Letter #', render: (item: LetterListItem) => <span className="font-mono text-xs">{item.letterNumber}</span> },
    { key: 'subject', header: 'Subject', render: (item: LetterListItem) => <span className="font-medium">{item.subject}</span> },
    { key: 'sender', header: 'Sender', render: (item: LetterListItem) => item.senderName },
    { key: 'priority', header: 'Priority', render: (item: LetterListItem) => <PriorityBadge priority={item.priority} /> },
    { key: 'status', header: 'Status', render: (item: LetterListItem) => <StatusBadge status={item.status} /> },
    { key: 'date', header: 'Date', render: (item: LetterListItem) => new Date(item.createdAt).toLocaleDateString() },
  ]

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading...</div></Layout>

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Letters</h1>
        <button onClick={() => router.push('/letters/new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> New Letter
        </button>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
        {['', 'Draft', 'Submitted', 'Approved', 'Sent', 'Received', 'Closed', 'Rejected'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={data?.items || []} loading={loading} onRowClick={(item) => router.push(`/letters/${item.id}`)} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </Layout>
  )
}
