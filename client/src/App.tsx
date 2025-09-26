import React from 'react'
import { Layout } from './components/Layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Spinner, OrbitSpinner } from './components/SharedUI'
import { useGetHealthQuery } from './services/api'
import { Satellite, Rocket, ChartBar as BarChart3, Shield } from 'lucide-react'
import { MissionArchitect } from './components/MissionArchitect'
import { cn } from './utils/cn'

type AppView = 'dashboard' | 'mission-architect'

const DashboardCard: React.FC<{
  title: string
  description: string
  value: string
  icon: React.ReactNode
  trend?: string
}> = ({ title, description, value, icon, trend }) => (
  <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-inter text-neutral-400">{title}</p>
          <p className="text-2xl font-space font-bold text-stellar-white">{value}</p>
          {trend && (
            <p className="text-xs text-green-400 font-inter">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-electric-blue/20 rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-sm text-neutral-500 mt-3 font-inter">{description}</p>
    </CardContent>
  </Card>
)

const App: React.FC = () => {
  const { data: healthData, isLoading: healthLoading, error: healthError } = useGetHealthQuery()
  const [currentView, setCurrentView] = React.useState<AppView>('dashboard')

  if (currentView === 'mission-architect') {
    return <MissionArchitect onClose={() => setCurrentView('dashboard')} />
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-space font-bold text-gradient-primary">
                Mission Control Dashboard
              </h1>
              <p className="text-lg text-neutral-400 font-inter mt-2">
                Advanced space mission planning and orbital analysis platform
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                {healthLoading ? (
                  <Spinner size="sm" />
                ) : healthError ? (
                  <div className="flex items-center space-x-2 text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>System Offline</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>System Operational</span>
                  </div>
                )}
              </div>
              
              <Button variant="primary" size="md">
                <span onClick={() => setCurrentView('mission-architect')}>New Mission</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Active Missions"
            description="Currently operational space missions"
            value="24"
            icon={<Satellite className="h-6 w-6 text-electric-blue" />}
            trend="+12% from last month"
          />
          
          <DashboardCard
            title="Satellites Tracked"
            description="Real-time satellite monitoring"
            value="1,247"
            icon={<BarChart3 className="h-6 w-6 text-cosmic-purple" />}
            trend="+8% from last week"
          />
          
          <DashboardCard
            title="Launch Vehicles"
            description="Available launch platforms"
            value="18"
            icon={<Rocket className="h-6 w-6 text-nebula-pink" />}
            trend="3 new this quarter"
          />
          
          <DashboardCard
            title="Risk Score"
            description="Overall mission safety rating"
            value="92%"
            icon={<Shield className="h-6 w-6 text-green-400" />}
            trend="Excellent safety record"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Missions */}
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Mission Activity</CardTitle>
              <CardDescription>
                Latest updates from active space missions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Satellite className="h-5 w-5 text-deep-space-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-inter font-medium text-stellar-white">
                      Starlink Mission {i + 47}
                    </p>
                    <p className="text-sm text-neutral-400">
                      Successfully deployed 60 satellites to LEO
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400 font-inter">Completed</p>
                    <p className="text-xs text-neutral-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Real-time platform monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <OrbitSpinner size="lg" />
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Mission Planning', status: 'Operational', color: 'green' },
                  { name: 'Satellite Tracking', status: 'Operational', color: 'green' },
                  { name: 'Cost Calculator', status: 'Operational', color: 'green' },
                  { name: 'Analytics Engine', status: 'Maintenance', color: 'yellow' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <span className="text-sm font-inter text-stellar-white">
                      {service.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        service.color === 'green' && 'bg-green-500',
                        service.color === 'yellow' && 'bg-yellow-500',
                        service.color === 'red' && 'bg-red-500'
                      )} />
                      <span className={cn(
                        'text-xs font-inter',
                        service.color === 'green' && 'text-green-400',
                        service.color === 'yellow' && 'text-yellow-400',
                        service.color === 'red' && 'text-red-400'
                      )}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for mission planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" size="lg" className="h-20 flex-col space-y-2">
                <Satellite className="h-6 w-6" />
                <span onClick={() => setCurrentView('mission-architect')}>Plan Mission</span>
              </Button>
              
              <Button variant="outline" size="lg" className="h-20 flex-col space-y-2">
                <Rocket className="h-6 w-6" />
                <span>Plan Launch</span>
              </Button>
              
              <Button variant="outline" size="lg" className="h-20 flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              
              <Button variant="outline" size="lg" className="h-20 flex-col space-y-2">
                <Shield className="h-6 w-6" />
                <span>Risk Assessment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default App