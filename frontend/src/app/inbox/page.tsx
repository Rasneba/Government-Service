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
import { useTranslation } from '@/lib/I18nContext'

export default function InboxPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [data, setData] = useState<PagedResult<LetterListItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadInbox()
  }, [page, router])

  async function loadInbox() {
    setLoading(true)
    try { const res = await api.get('/letters/inbox', { params: { page, pageSize: 20 } }); setData(res.data.data) }
    catch {} finally { setLoading(false) }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('nav.inbox')}</h1>
      <DataTable columns={columns} data={data?.items || []} loading={loading} onRowClick={(item) => router.push(`/letters/${item.id}`)} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </Layout>
  )
}
