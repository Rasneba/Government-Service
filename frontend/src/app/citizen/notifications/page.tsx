'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { CitizenNotificationDto, ApiResponse } from '@/types'

const typeColors: Record<string, string> = {
  Info: 'bg-blue-100 text-blue-700', Success: 'bg-green-100 text-green-700',
  Warning: 'bg-yellow-100 text-yellow-700', Error: 'bg-red-100 text-red-700',
}

export default function CitizenNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<CitizenNotificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    loadNotifications(token)
  }, [router, filter])

  const loadNotifications = async (token: string) => {
    const unreadOnly = filter === 'unread' ? 'true' : ''
    try {
      const res = await api.get<ApiResponse<CitizenNotificationDto[]>>(`/citizen/Notifications${unreadOnly ? '?unreadOnly=true' : ''}`, { headers: { Authorization: `Bearer ${token}` } })
      setNotifications(res.data.data)
    } catch {} finally { setLoading(false) }
  }

  const markRead = async (id: number) => {
    const token = localStorage.getItem('citizenToken')
    await api.put(`/citizen/Notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } })
    loadNotifications(token!)
  }

  const markAllRead = async () => {
    const token = localStorage.getItem('citizenToken')
    await api.put('/citizen/Notifications/read-all', {}, { headers: { Authorization: `Bearer ${token}` } })
    loadNotifications(token!)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-sm text-green-600 hover:underline">Mark all as read</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white border'}`}>All</button>
        <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-full text-sm ${filter === 'unread' ? 'bg-green-600 text-white' : 'bg-white border'}`}>Unread</button>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">No notifications</div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`bg-white border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors ${!n.isRead ? 'border-l-4 border-l-green-500' : ''}`}
              onClick={() => { if (!n.isRead) markRead(n.id) }}>
              <div className={`px-2 py-1 rounded text-xs font-medium ${typeColors[n.type] || 'bg-gray-100'}`}>{n.type}</div>
              <div className="flex-1">
                <div className="font-medium text-sm">{n.title}</div>
                {n.message && <div className="text-sm text-gray-500 mt-1">{n.message}</div>}
                <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
