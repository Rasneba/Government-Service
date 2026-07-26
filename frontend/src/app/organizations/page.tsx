'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import DataTable from '@/components/common/DataTable'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { Organization } from '@/types'
import { useTranslation } from '@/lib/I18nContext'

export default function OrganizationsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [data, setData] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadData()
  }, [router])

  async function loadData() {
    try { const res = await api.get('/organizations'); setData(res.data.data || []) }
    catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'name', header: t('profile.name'), render: (item: Organization) => item.name },
    { key: 'code', header: 'Code', render: (item: Organization) => item.code || 'N/A' },
    { key: 'description', header: t('applications.description'), render: (item: Organization) => item.description || 'N/A' },
    { key: 'active', header: t('common.status'), render: (item: Organization) => item.isActive ? 'Active' : 'Inactive' },
  ]

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">{t('common.loading')}</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('nav.organizations')}</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </Layout>
  )
}
