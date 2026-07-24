'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import DataTable from '@/components/common/DataTable'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { Department } from '@/types'

export default function DepartmentsPage() {
  const router = useRouter()
  const [data, setData] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadData()
  }, [router])

  async function loadData() {
    try { const res = await api.get('/departments'); setData(res.data.data || []) }
    catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'name', header: 'Name', render: (item: Department) => item.name },
    { key: 'code', header: 'Code', render: (item: Department) => item.code || 'N/A' },
    { key: 'org', header: 'Organization', render: (item: Department) => item.organizationName || 'N/A' },
    { key: 'active', header: 'Status', render: (item: Department) => item.isActive ? 'Active' : 'Inactive' },
  ]

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading...</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Departments</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </Layout>
  )
}
