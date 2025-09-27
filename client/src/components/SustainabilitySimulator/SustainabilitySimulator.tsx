import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingOverlay } from '../SharedUI'
import { Earth3D } from './Earth3D'
import { ControlPanel } from './ControlPanel'
import { NotificationPanel } from './NotificationPanel'
import { useSocket, ConjunctionWarning, DebrisUpdate } from '../../hooks/useSocket'
import { ArrowLeft, Maximize2, Minimize2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import { 
  SatelliteData, 
  DebrisObject, 
  ConjunctionEvent, 
  SimulationControls, 
  RiskAnalysisFactors, 
  ViewSettings 
} from './types'

interface SustainabilitySimulatorProps {
  onClose?: () => void
}

// Mock data generators for demonstration
const generateMockSatellites = (count: number): SatelliteData[] => {
  const satellites: SatelliteData[] = []
  const operators = ['SpaceX', 'OneWeb', 'Amazon', 'Planet Labs', 'Maxar', 'ESA', 'NASA']
  const missionTypes = ['Communications', 'Earth Observation', 'Navigation', 'Scientific', 'Internet']
  const statuses: SatelliteData['operational_status'][] = ['OPERATIONAL', 'DEGRADED', 'NON_OPERATIONAL', 'DEORBITING']

  for (let i = 0; i < count; i++) {
    const altitude = 400 + Math.random() * 1600 // 400-2000 km
    const latitude = (Math.random() - 0.5) * 180 // -90 to 90
    const longitude = (Math.random() - 0.5) * 360 // -180 to 180
    
    satellites.push({
      id: `sat_${i}`,
      name: `${operators[Math.floor(Math.random() * operators.length)]}-${i + 1}`,
      operator: operators[Math.floor(Math.random() * operators.length)],
      position: {
        latitude,
        longitude,
        altitude_km: altitude
      },
      velocity: {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8
      },
      operational_status: statuses[Math.floor(Math.random() * statuses.length)],
      mission_type: missionTypes[Math.floor(Math.random() * missionTypes.length)],
      mass_kg: 100 + Math.random() * 5000,
      collision_probability: Math.random() * 0.001,
      last_updated: new Date().toISOString()
    })
  }

  return satellites
}

const generateMockDebris = (count: number): DebrisObject[] => {
  const debris: DebrisObject[] = []
  const objectTypes: DebrisObject['object_type'][] = [
    'ROCKET_BODY', 'PAYLOAD_DEBRIS', 'MISSION_RELATED_DEBRIS', 'FRAGMENTATION_DEBRIS', 'UNKNOWN'
  ]
  const riskLevels: DebrisObject['collision_risk_level'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NEGLIGIBLE']

  for (let i = 0; i < count; i++) {
    const altitude = 300 + Math.random() * 1700 // 300-2000 km
    const latitude = (Math.random() - 0.5) * 180
    const longitude = (Math.random() - 0.5) * 360
    
    debris.push({
      id: `debris_${i}`,
      debris_id: `DEB-${String(i).padStart(6, '0')}`,
      object_type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
      position: {
        latitude,
        longitude,
        altitude_km: altitude
      },
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10
      },
      estimated_size_cm: 1 + Math.random() * 100,
      collision_risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      last_observation_date: new Date().toISOString()
    })
  }

  return debris
}

export const SustainabilitySimulator: React.FC<SustainabilitySimulatorProps> = ({ onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null)
  const [selectedDebris, setSelectedDebris] = useState<DebrisObject | null>(null)

  // Mock data
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [debris, setDebris] = useState<DebrisObject[]>([])

  // Simulation controls
  const [controls, setControls] = useState<SimulationControls>({
    timeScale: 1,
    currentTime: new Date(),
    isPlaying: false,
    showSatellites: true,
    showDebris: true,
    showOrbits: false,
    riskFilter: 'ALL',
    altitudeFilter: { min: 200, max: 2000 }
  })

  // Risk analysis factors
  const [riskFactors, setRiskFactors] = useState<RiskAnalysisFactors>({
    debrisDensity: true,
    conjunctionProbability: true,
    altitudeRisk: true,
    operationalStatus: true,
    missionDuration: false
  })

  // View settings
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    cameraPosition: { x: 15, y: 5, z: 15 },
    earthRotation: 0,
    showAtmosphere: true,
    showCountryBorders: false,
    showOceans: true,
    ambientLightIntensity: 0.4,
    directionalLightIntensity: 1.0
  })

  // WebSocket connection
  const {
    isConnected,
    connectionState,
    conjunctionWarnings,
    debrisUpdates,
    clearWarnings,
    clearDebrisUpdates
  } = useSocket({
    url: 'ws://localhost:8080/ws',
    onConnect: () => console.log('Connected to sustainability simulator WebSocket'),
    onDisconnect: () => console.log('Disconnected from sustainability simulator WebSocket'),
    onError: (error) => console.error('WebSocket error:', error)
  })

  // Initialize mock data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSatellites(generateMockSatellites(150))
      setDebris(generateMockDebris(75))
      
      setIsLoading(false)
    }

    initializeData()
  }, [])

  // Time simulation
  useEffect(() => {
    if (!controls.isPlaying) return

    const interval = setInterval(() => {
      setControls(prev => ({
        ...prev,
        currentTime: new Date(prev.currentTime.getTime() + (prev.timeScale * 1000))
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [controls.isPlaying, controls.timeScale])

  // Filter data based on controls
  const filteredSatellites = useMemo(() => {
    if (!controls.showSatellites) return []
    
    return satellites.filter(sat => {
      // Altitude filter
      if (sat.position.altitude_km < controls.altitudeFilter.min || 
          sat.position.altitude_km > controls.altitudeFilter.max) {
        return false
      }

      // Risk filter
      if (controls.riskFilter === 'HIGH_RISK_ONLY') {
        return (sat.collision_probability || 0) > 0.0001
      }
      if (controls.riskFilter === 'CRITICAL_ONLY') {
        return (sat.collision_probability || 0) > 0.001
      }

      return true
    })
  }, [satellites, controls])

  const filteredDebris = useMemo(() => {
    if (!controls.showDebris) return []
    
    return debris.filter(deb => {
      // Altitude filter
      if (deb.position.altitude_km < controls.altitudeFilter.min || 
          deb.position.altitude_km > controls.altitudeFilter.max) {
        return false
      }

      // Risk filter
      if (controls.riskFilter === 'HIGH_RISK_ONLY') {
        return ['HIGH', 'CRITICAL'].includes(deb.collision_risk_level)
      }
      if (controls.riskFilter === 'CRITICAL_ONLY') {
        return deb.collision_risk_level === 'CRITICAL'
      }

      return true
    })
  }, [debris, controls])

  // Convert WebSocket events to conjunction events for visualization
  const conjunctionEvents: ConjunctionEvent[] = useMemo(() => {
    return conjunctionWarnings.map(warning => ({
      id: warning.id,
      primary_object_id: warning.primary_object_id,
      secondary_object_id: warning.secondary_object_id,
      time_of_closest_approach: warning.time_of_closest_approach,
      miss_distance_km: warning.miss_distance_km,
      collision_probability: warning.collision_probability,
      relative_velocity_km_s: 7.5, // Mock value
      risk_level: warning.risk_level,
      position: {
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
        altitude_km: 500 + Math.random() * 1000
      }
    }))
  }, [conjunctionWarnings])

  const handleControlsChange = useCallback((updates: Partial<SimulationControls>) => {
    setControls(prev => ({ ...prev, ...updates }))
  }, [])

  const handleRiskFactorsChange = useCallback((updates: Partial<RiskAnalysisFactors>) => {
    setRiskFactors(prev => ({ ...prev, ...updates }))
  }, [])

  const handleViewSettingsChange = useCallback((updates: Partial<ViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const handleSatelliteClick = useCallback((satellite: SatelliteData) => {
    setSelectedSatellite(satellite)
    console.log('Selected satellite:', satellite)
  }, [])

  const handleDebrisClick = useCallback((debris: DebrisObject) => {
    setSelectedDebris(debris)
    console.log('Selected debris:', debris)
  }, [])

  const handleWarningClick = useCallback((warning: ConjunctionWarning) => {
    console.log('Warning clicked:', warning)
    // Could focus camera on the conjunction location
  }, [])

  const handleDebrisUpdateClick = useCallback((debris: DebrisUpdate) => {
    console.log('Debris update clicked:', debris)
    // Could focus camera on the debris location
  }, [])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSatellites(generateMockSatellites(150))
    setDebris(generateMockDebris(75))
    setIsLoading(false)
  }, [])

  return (
    <div className={cn(
      "min-h-screen bg-deep-space-black",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-deep-space-black/90 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-electric-blue animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-space font-bold text-gradient-primary">
                    Orbital Sustainability Simulator
                  </h1>
                  <p className="text-sm text-neutral-400">
                    Real-time 3D visualization of orbital environment
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Wifi className="h-4 w-4" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-400">
                    <WifiOff className="h-4 w-4" />
                    <span>Disconnected</span>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-neutral-800 bg-neutral-950/50 overflow-y-auto">
          <div className="p-4">
            <ControlPanel
              controls={controls}
              riskFactors={riskFactors}
              viewSettings={viewSettings}
              onControlsChange={handleControlsChange}
              onRiskFactorsChange={handleRiskFactorsChange}
              onViewSettingsChange={handleViewSettingsChange}
              satelliteCount={filteredSatellites.length}
              debrisCount={filteredDebris.length}
              conjunctionCount={conjunctionEvents.length}
            />
          </div>
        </div>

        {/* Center - 3D Visualization */}
        <div className="flex-1 relative">
          <LoadingOverlay isLoading={isLoading} message="Loading orbital data...">
            <Earth3D
              satellites={filteredSatellites}
              debris={filteredDebris}
              conjunctionEvents={conjunctionEvents}
              viewSettings={viewSettings}
              onSatelliteClick={handleSatelliteClick}
              onDebrisClick={handleDebrisClick}
              className="w-full h-full"
            />
          </LoadingOverlay>

          {/* Overlay Info */}
          {(selectedSatellite || selectedDebris) && (
            <div className="absolute top-4 left-4 max-w-sm">
              <Card variant="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {selectedSatellite ? 'Satellite Details' : 'Debris Details'}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSatellite(null)
                        setSelectedDebris(null)
                      }}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  {selectedSatellite && (
                    <>
                      <div><strong>Name:</strong> {selectedSatellite.name}</div>
                      <div><strong>Operator:</strong> {selectedSatellite.operator}</div>
                      <div><strong>Mission:</strong> {selectedSatellite.mission_type}</div>
                      <div><strong>Status:</strong> {selectedSatellite.operational_status}</div>
                      <div><strong>Mass:</strong> {selectedSatellite.mass_kg.toFixed(0)} kg</div>
                      <div><strong>Altitude:</strong> {selectedSatellite.position.altitude_km.toFixed(1)} km</div>
                      <div><strong>Position:</strong> {selectedSatellite.position.latitude.toFixed(2)}°, {selectedSatellite.position.longitude.toFixed(2)}°</div>
                    </>
                  )}
                  {selectedDebris && (
                    <>
                      <div><strong>ID:</strong> {selectedDebris.debris_id}</div>
                      <div><strong>Type:</strong> {selectedDebris.object_type.replace('_', ' ')}</div>
                      <div><strong>Size:</strong> {selectedDebris.estimated_size_cm} cm</div>
                      <div><strong>Risk Level:</strong> {selectedDebris.collision_risk_level}</div>
                      <div><strong>Altitude:</strong> {selectedDebris.position.altitude_km.toFixed(1)} km</div>
                      <div><strong>Position:</strong> {selectedDebris.position.latitude.toFixed(2)}°, {selectedDebris.position.longitude.toFixed(2)}°</div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Panel - Notifications */}
        <div className="w-96 border-l border-neutral-800 bg-neutral-950/50 overflow-y-auto">
          <div className="p-4">
            <NotificationPanel
              conjunctionWarnings={conjunctionWarnings}
              debrisUpdates={debrisUpdates}
              onClearWarnings={clearWarnings}
              onClearDebrisUpdates={clearDebrisUpdates}
              onWarningClick={handleWarningClick}
              onDebrisClick={handleDebrisUpdateClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}