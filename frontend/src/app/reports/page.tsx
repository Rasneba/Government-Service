'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout/Layout'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { LetterReport, MonthlyReport, DepartmentPerformance, PagedResult } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ReportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'letters' | 'monthly' | 'performance'>('letters')
  const [letterData, setLetterData] = useState<PagedResult<LetterReport> | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([])
  const [performanceData, setPerformanceData] = useState<DepartmentPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) { router.replace('/login'); return }
    loadReports()
  }, [activeTab, year, router])

  async function loadReports() {
    setLoading(true)
    try {
      if (activeTab === 'letters') {
        const params: Record<string, string | number> = { page: 1, pageSize: 20 }
        if (dateFrom) params.dateFrom = dateFrom; if (dateTo) params.dateTo = dateTo
        const res = await api.get('/reports/letters', { params }); setLetterData(res.data.data)
      } else if (activeTab === 'monthly') {
        const res = await api.get('/reports/monthly', { params: { year } }); setMonthlyData(res.data.data || [])
      } else if (activeTab === 'performance') {
        const params: Record<string, string> = {}
        if (dateFrom) params.dateFrom = dateFrom; if (dateTo) params.dateTo = dateTo
        const res = await api.get('/reports/department-performance', { params }); setPerformanceData(res.data.data || [])
      }
    } catch {} finally { setLoading(false) }
  }

  if (!mounted) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading...</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['letters', 'monthly', 'performance'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {tab === 'letters' ? 'Letter Report' : tab === 'monthly' ? 'Monthly Report' : 'Department Performance'}
          </button>
        ))}
      </div>
      {activeTab === 'letters' && (
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
            <button onClick={loadReports} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm">Filter</button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Letter #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(letterData?.items || []).map((l, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">{l.letterNumber}</td>
                    <td className="px-4 py-3 text-sm">{l.subject}</td>
                    <td className="px-4 py-3 text-sm">{l.senderName}</td>
                    <td className="px-4 py-3 text-sm">{l.department}</td>
                    <td className="px-4 py-3 text-sm">{l.status}</td>
                    <td className="px-4 py-3 text-sm">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'monthly' && (
        <div>
          <div className="mb-4"><input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="border rounded-lg px-3 py-1.5 text-sm w-24" /></div>
          <div className="bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="monthName" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="incoming" fill="#3b82f6" name="Incoming" /><Bar dataKey="outgoing" fill="#10b981" name="Outgoing" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" /><Bar dataKey="completed" fill="#6366f1" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {activeTab === 'performance' && (
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
            <button onClick={loadReports} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm">Filter</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="departmentName" type="category" width={150} /><Tooltip /><Legend />
                <Bar dataKey="completedLetters" fill="#10b981" name="Completed" /><Bar dataKey="pendingLetters" fill="#f59e0b" name="Pending" /><Bar dataKey="overdueLetters" fill="#ef4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  )
}
