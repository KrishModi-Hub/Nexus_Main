import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../SharedUI'
import { Play, Pause, RotateCcw, Settings, Eye, EyeOff, Zap, TriangleAlert as AlertTriangle, Satellite, Trash2, Globe, Sun, Moon } from 'lucide-react'
import { cn } from '../../utils/cn'
import { SimulationControls, RiskAnalysisFactors, ViewSettings } from './types'

interface ControlPanelProps {
  controls: SimulationControls
  riskFactors: RiskAnalysisFactors
  viewSettings: ViewSettings
  onControlsChange: (controls: Partial<SimulationControls>) => void
  onRiskFactorsChange: (factors: Partial<RiskAnalysisFactors>) => void
  onViewSettingsChange: (settings: Partial<ViewSettings>) => void
  satelliteCount: number
  debrisCount: number
  conjunctionCount: number
  className?: string
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  riskFactors,
  viewSettings,
  onControlsChange,
  onRiskFactorsChange,
  onViewSettingsChange,
  satelliteCount,
  debrisCount,
  conjunctionCount,
  className
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getTimeScaleLabel = (scale: number) => {
    if (scale === 1) return 'Real Time'
    if (scale < 60) return `${scale}x Speed`
    if (scale === 60) return '1 min/sec'
    if (scale < 3600) return `${scale / 60} min/sec`
    return `${scale / 3600} hr/sec`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Overview */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Orbital Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-400">{satelliteCount}</div>
              <div className="text-xs text-neutral-400">Active Satellites</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-400">{debrisCount}</div>
              <div className="text-xs text-neutral-400">Debris Objects</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-400">{conjunctionCount}</div>
              <div className="text-xs text-neutral-400">Active Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Controls */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Time Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={controls.isPlaying ? "danger" : "primary"}
              size="sm"
              onClick={() => onControlsChange({ isPlaying: !controls.isPlaying })}
            >
              {controls.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onControlsChange({ currentTime: new Date() })}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-xs text-stellar-white">
              {formatTime(controls.currentTime)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stellar-white">
              Time Scale: {getTimeScaleLabel(controls.timeScale)}
            </label>
            <input
              type="range"
              min="1"
              max="3600"
              step="1"
              value={controls.timeScale}
              onChange={(e) => onControlsChange({ timeScale: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>1x</span>
              <span>60x</span>
              <span>1hr/s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Display Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={controls.showSatellites}
                onChange={(e) => onControlsChange({ showSatellites: e.target.checked })}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <Satellite className="h-4 w-4 text-green-400" />
              <span className="text-sm text-stellar-white">Show Satellites</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={controls.showDebris}
                onChange={(e) => onControlsChange({ showDebris: e.target.checked })}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <Trash2 className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-stellar-white">Show Debris</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={controls.showOrbits}
                onChange={(e) => onControlsChange({ showOrbits: e.target.checked })}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <Globe className="h-4 w-4 text-electric-blue" />
              <span className="text-sm text-stellar-white">Show Orbits</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={viewSettings.showAtmosphere}
                onChange={(e) => onViewSettingsChange({ showAtmosphere: e.target.checked })}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <div className="h-4 w-4 rounded-full bg-blue-400/50" />
              <span className="text-sm text-stellar-white">Show Atmosphere</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stellar-white">Risk Filter</label>
            <select
              value={controls.riskFilter}
              onChange={(e) => onControlsChange({ riskFilter: e.target.value as any })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-700 bg-neutral-900/50 text-stellar-white focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:outline-none"
            >
              <option value="ALL">Show All Objects</option>
              <option value="HIGH_RISK_ONLY">High Risk Only</option>
              <option value="CRITICAL_ONLY">Critical Risk Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stellar-white">
              Altitude Range: {controls.altitudeFilter.min} - {controls.altitudeFilter.max} km
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={controls.altitudeFilter.min}
                onChange={(e) => onControlsChange({ 
                  altitudeFilter: { 
                    ...controls.altitudeFilter, 
                    min: parseInt(e.target.value) 
                  } 
                })}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={controls.altitudeFilter.max}
                onChange={(e) => onControlsChange({ 
                  altitudeFilter: { 
                    ...controls.altitudeFilter, 
                    max: parseInt(e.target.value) 
                  } 
                })}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis Factors */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(riskFactors).map(([key, enabled]) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onRiskFactorsChange({ [key]: e.target.checked })}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <span className="text-sm text-stellar-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Lighting Controls */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Sun className="h-5 w-5 mr-2" />
            Lighting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stellar-white">
              Ambient Light: {Math.round(viewSettings.ambientLightIntensity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={viewSettings.ambientLightIntensity}
              onChange={(e) => onViewSettingsChange({ ambientLightIntensity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stellar-white">
              Directional Light: {Math.round(viewSettings.directionalLightIntensity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={viewSettings.directionalLightIntensity}
              onChange={(e) => onViewSettingsChange({ directionalLightIntensity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}