import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../SharedUI'
import { TriangleAlert as AlertTriangle, X, Clock, Satellite, Trash2, Zap, ChevronDown, ChevronUp, ListFilter as Filter } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ConjunctionWarning, DebrisUpdate } from '../../hooks/useSocket'

interface NotificationPanelProps {
  conjunctionWarnings: ConjunctionWarning[]
  debrisUpdates: DebrisUpdate[]
  onClearWarnings: () => void
  onClearDebrisUpdates: () => void
  onWarningClick?: (warning: ConjunctionWarning) => void
  onDebrisClick?: (debris: DebrisUpdate) => void
  className?: string
}

type NotificationFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  conjunctionWarnings,
  debrisUpdates,
  onClearWarnings,
  onClearDebrisUpdates,
  onWarningClick,
  onDebrisClick,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [filter, setFilter] = useState<NotificationFilter>('ALL')
  const [showConjunctions, setShowConjunctions] = useState(true)
  const [showDebris, setShowDebris] = useState(true)

  // Filter warnings based on risk level
  const filteredWarnings = conjunctionWarnings.filter(warning => {
    if (filter === 'ALL') return true
    return warning.risk_level === filter
  })

  // Filter debris updates based on risk level
  const filteredDebris = debrisUpdates.filter(debris => {
    if (filter === 'ALL') return true
    return debris.risk_level === filter
  })

  // Auto-expand when new critical alerts arrive
  useEffect(() => {
    const hasCritical = conjunctionWarnings.some(w => w.risk_level === 'CRITICAL') ||
                      debrisUpdates.some(d => d.risk_level === 'CRITICAL')
    if (hasCritical && !isExpanded) {
      setIsExpanded(true)
    }
  }, [conjunctionWarnings, debrisUpdates, isExpanded])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-neutral-400 bg-neutral-500/20 border-neutral-500/30'
    }
  }

  const totalAlerts = filteredWarnings.length + filteredDebris.length

  return (
    <Card variant="glass" className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alerts & Notifications
            {totalAlerts > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                {totalAlerts}
              </span>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as NotificationFilter)}
                className="px-2 py-1 text-xs rounded border border-neutral-700 bg-neutral-900/50 text-stellar-white focus:border-electric-blue focus:outline-none"
              >
                <option value="ALL">All Levels</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearWarnings}
                disabled={conjunctionWarnings.length === 0}
              >
                Clear Warnings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearDebrisUpdates}
                disabled={debrisUpdates.length === 0}
              >
                Clear Debris
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Toggle Sections */}
          <div className="flex items-center space-x-4 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showConjunctions}
                onChange={(e) => setShowConjunctions(e.target.checked)}
                className="h-3 w-3 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <Satellite className="h-4 w-4 text-red-400" />
              <span className="text-stellar-white">Conjunctions ({filteredWarnings.length})</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDebris}
                onChange={(e) => setShowDebris(e.target.checked)}
                className="h-3 w-3 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <Trash2 className="h-4 w-4 text-yellow-400" />
              <span className="text-stellar-white">Debris ({filteredDebris.length})</span>
            </label>
          </div>

          {/* Conjunction Warnings */}
          {showConjunctions && (
            <div className="space-y-2">
              {filteredWarnings.length === 0 ? (
                <div className="text-center py-4 text-neutral-400 text-sm">
                  No conjunction warnings
                </div>
              ) : (
                filteredWarnings.map((warning) => (
                  <div
                    key={warning.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                      getRiskColor(warning.risk_level)
                    )}
                    onClick={() => onWarningClick?.(warning)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Satellite className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            Conjunction Alert
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            getRiskColor(warning.risk_level)
                          )}>
                            {warning.risk_level}
                          </span>
                        </div>
                        
                        <div className="text-xs space-y-1 text-neutral-300">
                          <div>Objects: {warning.primary_object_id} ↔ {warning.secondary_object_id}</div>
                          <div>Miss Distance: {warning.miss_distance_km.toFixed(3)} km</div>
                          <div>Collision Probability: {(warning.collision_probability * 100).toFixed(6)}%</div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>TCA: {new Date(warning.time_of_closest_approach).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Debris Updates */}
          {showDebris && (
            <div className="space-y-2">
              {filteredDebris.length === 0 ? (
                <div className="text-center py-4 text-neutral-400 text-sm">
                  No debris updates
                </div>
              ) : (
                filteredDebris.map((debris) => (
                  <div
                    key={debris.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                      getRiskColor(debris.risk_level)
                    )}
                    onClick={() => onDebrisClick?.(debris)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Trash2 className="h-4 w-4" />
                          <span className="font-medium text-sm">
                            Debris Update
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            getRiskColor(debris.risk_level)
                          )}>
                            {debris.risk_level}
                          </span>
                        </div>
                        
                        <div className="text-xs space-y-1 text-neutral-300">
                          <div>ID: {debris.debris_id}</div>
                          <div>Size: {debris.size_estimate_cm} cm</div>
                          <div>
                            Position: {debris.position.latitude.toFixed(2)}°, {debris.position.longitude.toFixed(2)}°
                          </div>
                          <div>Altitude: {debris.position.altitude_km.toFixed(1)} km</div>
                          <div>
                            Velocity: {Math.sqrt(
                              debris.velocity.x ** 2 + 
                              debris.velocity.y ** 2 + 
                              debris.velocity.z ** 2
                            ).toFixed(2)} km/s
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {totalAlerts === 0 && (
            <div className="text-center py-8 text-neutral-400">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">All systems nominal</div>
              <div className="text-xs">No active alerts or warnings</div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}