import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAppSelector } from '../../hooks'
import { cn } from '../../utils/cn'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-deep-space-black">
      <Sidebar />
      
      <div className={cn(
        'flex flex-col min-h-screen transition-all duration-300',
        'lg:ml-64' // Always account for sidebar on desktop
      )}>
        <Header />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <span>© 2024 Orbital Nexus</span>
                <span>•</span>
                <span>Space Mission Planning Platform</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <span>Version 1.0.0</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}