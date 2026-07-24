'use client'

import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Notification } from '@/types'
import Link from 'next/link'

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadNotifications() {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notifications?unreadOnly=true'),
        api.get('/notifications/unread-count'),
      ])
      setNotifications(notifRes.data.data || [])
      setUnreadCount(countRes.data.data?.totalUnread || 0)
    } catch {
      // silently fail
    }
  }

  async function markAsRead(id: number) {
    await api.put(`/notifications/${id}/read`)
    loadNotifications()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded">
        <Menu size={24} />
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-100 rounded"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-3 border-b font-semibold text-sm">Notifications</div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => markAsRead(n.id)}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.message && <p className="text-xs text-gray-500 mt-1">{n.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  )
}
