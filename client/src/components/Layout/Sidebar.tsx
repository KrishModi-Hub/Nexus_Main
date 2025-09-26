import React from 'react'
import { Hop as Home, Satellite, Rocket, ChartBar as BarChart3, Shield, Calculator, Settings, Circle as HelpCircle, ChevronLeft, Globe, Zap, Target } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setSidebarOpen } from '../../store/slices/uiSlice'
import { Button } from '../SharedUI'
import { cn } from '../../utils/cn'

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    href: '/',
  },
  {
    id: 'missions',
    label: 'Mission Planning',
    icon: <Target className="h-5 w-5" />,
    href: '/missions',
    children: [
      {
        id: 'missions-overview',
        label: 'Overview',
        icon: <Globe className="h-4 w-4" />,
        href: '/missions',
      },
      {
        id: 'missions-create',
        label: 'Create Mission',
        icon: <Zap className="h-4 w-4" />,
        href: '/missions/create',
      },
    ],
  },
  {
    id: 'satellites',
    label: 'Satellite Tracking',
    icon: <Satellite className="h-5 w-5" />,
    href: '/satellites',
  },
  {
    id: 'launches',
    label: 'Launch Vehicles',
    icon: <Rocket className="h-5 w-5" />,
    href: '/launches',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/analytics',
    badge: 'New',
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    icon: <Shield className="h-5 w-5" />,
    href: '/sustainability',
  },
  {
    id: 'calculator',
    label: 'Cost Calculator',
    icon: <Calculator className="h-5 w-5" />,
    href: '/calculator',
  },
]

const bottomItems: SidebarItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <HelpCircle className="h-5 w-5" />,
    href: '/help',
  },
]

interface SidebarItemComponentProps {
  item: SidebarItem
  isCollapsed: boolean
  isActive?: boolean
  level?: number
}

const SidebarItemComponent: React.FC<SidebarItemComponentProps> = ({
  item,
  isCollapsed,
  isActive = false,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 text-sm font-inter rounded-lg transition-all duration-200',
          'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-electric-blue/20',
          isActive && 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30',
          !isActive && 'text-neutral-300 hover:text-stellar-white',
          level > 0 && 'ml-4 text-xs'
        )}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <div className="flex items-center space-x-3">
          <div className={cn('flex-shrink-0', level > 0 && 'opacity-70')}>
            {item.icon}
          </div>
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-nebula-pink text-stellar-white rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded && 'rotate-90'
                )}
              />
            )}
          </div>
        )}
      </button>
      
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-neutral-950/90 backdrop-blur-xl border-r border-neutral-800 transition-all duration-300',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Satellite className="h-5 w-5 text-deep-space-black" />
                </div>
                <div>
                  <h2 className="text-sm font-space font-bold text-stellar-white">
                    Orbital Nexus
                  </h2>
                  <p className="text-xs text-neutral-400">Mission Control</p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex h-8 w-8 p-0"
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
            {sidebarItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={item.id === 'dashboard'} // Placeholder for active state
              />
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-neutral-800 space-y-2">
            {bottomItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Status indicator */}
          {!isCollapsed && (
            <div className="p-4 border-t border-neutral-800">
              <div className="flex items-center space-x-3 text-xs text-neutral-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>System Operational</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}