'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Mail, Inbox, Send, Users, Building2, Building, BarChart3, Search,
  LogOut, ChevronLeft, ChevronRight, Briefcase, FileText, UserCheck, Shield,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { logout, getStoredUser } from '@/lib/auth'
import type { User } from '@/types'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['*'] },
  { href: '/services', label: 'Services', icon: Briefcase, roles: ['*'] },
  { href: '/applications', label: 'Applications', icon: FileText, roles: ['*'] },
  { href: '/letters', label: 'All Letters', icon: Mail, roles: ['*'] },
  { href: '/letters/new', label: 'New Letter', icon: Mail, roles: ['SystemAdministrator', 'SubCityAdministrator', 'PoliceAdministrator', 'DepartmentOfficer', 'Clerk'] },
  { href: '/inbox', label: 'Inbox', icon: Inbox, roles: ['*'] },
  { href: '/outbox', label: 'Outbox', icon: Send, roles: ['*'] },
  { href: '/search', label: 'Search', icon: Search, roles: ['*'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['SystemAdministrator', 'SubCityAdministrator'] },
  { href: '/organizations', label: 'Organizations', icon: Building2, roles: ['SystemAdministrator'] },
  { href: '/departments', label: 'Departments', icon: Building, roles: ['SystemAdministrator', 'SubCityAdministrator', 'PoliceAdministrator'] },
  { href: '/police/login', label: 'Police Portal', icon: Shield, roles: ['SystemAdministrator', 'SubCityAdministrator'], external: true },
  { href: '/citizen/dashboard', label: 'Citizen Portal', icon: UserCheck, roles: ['SystemAdministrator', 'SubCityAdministrator'], external: true },
  { href: '/reports', label: 'Reports', icon: BarChart3, roles: ['SystemAdministrator', 'SubCityAdministrator', 'PoliceAdministrator'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { setUser(getStoredUser()) }, [])

  const filteredItems = menuItems.filter(item => item.roles.includes('*') || (user && item.roles.includes(user.role)))

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg">Certificate System</h1>
            <p className="text-xs text-gray-400">{user?.organizationName || 'Sub-City'}</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-gray-700">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {filteredItems.map((item) => {
          const isActive = !item.external && pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <div className="mb-2">
            <p className="text-sm font-medium truncate">{user?.fullName || 'Loading...'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role || ''}</p>
          </div>
        )}
        <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full">
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
