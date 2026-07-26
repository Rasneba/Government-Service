'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import DataTable from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { User, PagedResult } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

export default function UsersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [data, setData] = useState<PagedResult<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadUsers()
  }, [page, router])

  async function loadUsers() {
    setLoading(true)
    try { const res = await api.get('/users', { params: { page, pageSize: 20 } }); setData(res.data.data) }
    catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'name', header: t('auth.fullName'), render: (item: User) => item.fullName },
    { key: 'username', header: t('auth.username'), render: (item: User) => item.username },
    { key: 'email', header: t('profile.email'), render: (item: User) => item.email },
    { key: 'role', header: 'Role', render: (item: User) => <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{item.role}</span> },
    { key: 'department', header: 'Department', render: (item: User) => item.departmentName || 'N/A' },
  ]

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">{t('common.loading')}</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('nav.users')}</h1>
      <DataTable columns={columns} data={data?.items || []} loading={loading} />
      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </Layout>
  )
}
