'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileSidebar, setMobileSidebar] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="relative">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileSidebar(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
