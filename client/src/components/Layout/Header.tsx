import React from 'react'
import { Menu, Bell, Settings, User, Satellite } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { Button } from '../SharedUI'
import { cn } from '../../utils/cn'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 glass">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Satellite className="h-5 w-5 text-deep-space-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-space font-bold text-gradient-primary">
                Orbital Nexus
              </h1>
              <p className="text-xs text-neutral-400 font-inter">
                Space Mission Planning Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center section - Search (placeholder for now) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search missions, satellites, or operators..."
              className="w-full px-4 py-2 text-sm bg-neutral-900/50 border border-neutral-700 rounded-lg text-stellar-white placeholder-neutral-500 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/20 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-nebula-pink rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="hidden sm:block w-px h-6 bg-neutral-700" />
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-stellar-white" />
            </div>
            <span className="hidden lg:block text-sm font-inter">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  )
}