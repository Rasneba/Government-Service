import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sub-City Letter Tracking System',
  description: 'Correspondence Management System for Sub-City and Police Departments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}