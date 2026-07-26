'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { DashboardData } from '@/types'
import { Mail, Inbox, Send, Clock, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTranslation } from '@/lib/I18nContext'

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444']

export default function DashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadDashboard()
  }, [router])

  async function loadDashboard() {
    try {
      const res = await api.get('/dashboard')
      setData(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">{t('common.loading')}</div></Layout>
  if (loading) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">{t('common.loading')}</div></Layout>
  if (!data) return <Layout><div className="flex items-center justify-center h-64 text-red-500">{t('common.error')}</div></Layout>

  const stats = [
    { label: t('dashboard.totalApplications'), value: data.totalLetters, icon: Mail, color: 'bg-blue-500' },
    { label: 'Incoming Today', value: data.incomingToday, icon: Inbox, color: 'bg-green-500' },
    { label: 'Outgoing Today', value: data.outgoingToday, icon: Send, color: 'bg-indigo-500' },
    { label: t('status.pending'), value: data.pendingLetters, icon: Clock, color: 'bg-yellow-500' },
    { label: t('dashboard.overdue'), value: data.overdueLetters, icon: AlertTriangle, color: 'bg-red-500' },
  ]

  const pieData = data.departmentStats.map((d) => ({ name: d.departmentName, value: d.totalLetters }))

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}><stat.icon className="text-white" size={20} /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Letters by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="departmentName" tick={{ fontSize: 12 }} /><YAxis /><Tooltip />
              <Bar dataKey="totalLetters" fill="#3b82f6" name={t('common.total')} /><Bar dataKey="completedLetters" fill="#10b981" name={t('dashboard.completed')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {pieData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Recently Received</h2>
          {data.recentlyReceived.length === 0 ? <p className="text-gray-500 text-sm">{t('common.noData')}</p> : (
            <div className="space-y-2">{data.recentlyReceived.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => router.push(`/letters/${l.id}`)}>
                <div><p className="text-sm font-medium">{l.subject}</p><p className="text-xs text-gray-500">{l.senderName}</p></div>
                <span className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</span>
              </div>
            ))}</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          {data.recentActivities.length === 0 ? <p className="text-gray-500 text-sm">{t('common.noData')}</p> : (
            <div className="space-y-2">{data.recentActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1"><p className="text-sm"><span className="font-medium">{a.userName}</span> {a.action.toLowerCase()}</p>{a.details && <p className="text-xs text-gray-500">{a.details}</p>}</div>
                <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </Layout>
  )
}
