export interface SatelliteData {
  id: string
  name: string
  operator: string
  position: {
    latitude: number
    longitude: number
    altitude_km: number
  }
  velocity: {
    x: number
    y: number
    z: number
  }
  operational_status: 'OPERATIONAL' | 'DEGRADED' | 'NON_OPERATIONAL' | 'DEORBITING' | 'UNKNOWN'
  mission_type: string
  mass_kg: number
  collision_probability?: number
  last_updated: string
}

export interface DebrisObject {
  id: string
  debris_id: string
  object_type: 'ROCKET_BODY' | 'PAYLOAD_DEBRIS' | 'MISSION_RELATED_DEBRIS' | 'FRAGMENTATION_DEBRIS' | 'UNKNOWN'
  position: {
    latitude: number
    longitude: number
    altitude_km: number
  }
  velocity: {
    x: number
    y: number
    z: number
  }
  estimated_size_cm: number
  collision_risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NEGLIGIBLE'
  last_observation_date: string
}

export interface ConjunctionEvent {
  id: string
  primary_object_id: string
  secondary_object_id: string
  time_of_closest_approach: string
  miss_distance_km: number
  collision_probability: number
  relative_velocity_km_s: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  position: {
    latitude: number
    longitude: number
    altitude_km: number
  }
}

export interface SimulationControls {
  timeScale: number // 1 = real time, 60 = 1 minute per second
  currentTime: Date
  isPlaying: boolean
  showSatellites: boolean
  showDebris: boolean
  showOrbits: boolean
  riskFilter: 'ALL' | 'HIGH_RISK_ONLY' | 'CRITICAL_ONLY'
  altitudeFilter: {
    min: number
    max: number
  }
}

export interface RiskAnalysisFactors {
  debrisDensity: boolean
  conjunctionProbability: boolean
  altitudeRisk: boolean
  operationalStatus: boolean
  missionDuration: boolean
}

export interface ViewSettings {
  cameraPosition: {
    x: number
    y: number
    z: number
  }
  earthRotation: number
  showAtmosphere: boolean
  showCountryBorders: boolean
  showOceans: boolean
  ambientLightIntensity: number
  directionalLightIntensity: number
}