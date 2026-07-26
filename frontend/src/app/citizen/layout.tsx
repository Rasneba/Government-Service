'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LogOut, Menu, X } from 'lucide-react'
import { citizenLogout } from '@/lib/auth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

const navItems = [
  { href: '/citizen/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/citizen/services', label: 'Services', icon: '🏛️' },
  { href: '/citizen/applications', label: 'My Applications', icon: '📋' },
  { href: '/citizen/documents', label: 'Documents', icon: '📄' },
  { href: '/citizen/appointments', label: 'Appointments', icon: '📅' },
  { href: '/citizen/complaints', label: 'Complaints', icon: '⚠️' },
  { href: '/citizen/feedback', label: 'Feedback', icon: '⭐' },
  { href: '/citizen/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/citizen/profile', label: 'Profile', icon: '👤' },
]

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex items-center gap-3">
          <Shield className="text-green-600" size={24} />
          <div>
            <h1 className="font-bold">Citizen Portal</h1>
            <p className="text-xs text-gray-500">Government Services</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden"><X size={20} /></button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/citizen/dashboard' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-3 border-t">
          <LanguageSwitcher />
          <button onClick={citizenLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 w-full px-3 py-2 text-sm mt-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={24} /></button>
          <h2 className="text-sm font-medium text-gray-500">Sub-City Administration</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
