import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '@supabase/supabase-client'

interface Props {
  children: React.ReactNode
  profile: any
}

export default function DashboardLayout({ children, profile }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Products', path: '/products' },
    { label: 'Orders', path: '/orders' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Deliveries', path: '/deliveries' },
    { label: 'Returns', path: '/returns' },
    { label: 'Customers', path: '/customers' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300`}>
        <div className="p-6 font-bold text-xl">WOODEX</div>
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 ${
                location.pathname === item.path
                  ? 'bg-amber-600'
                  : 'hover:bg-slate-800'
              } ${sidebarOpen ? '' : 'text-center'}`}
            >
              {sidebarOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">{profile?.full_name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
  )
}
