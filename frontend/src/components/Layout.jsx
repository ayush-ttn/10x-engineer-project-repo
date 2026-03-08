import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children, collections = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-stone-100/80 lg:flex-row">
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collections={collections} />
      <main className="flex-1 p-4 pt-20 lg:pt-20 lg:p-6">{children}</main>
    </div>
  )
}
