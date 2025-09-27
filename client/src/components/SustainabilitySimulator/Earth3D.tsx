import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { SatelliteData, DebrisObject, ConjunctionEvent, ViewSettings } from './types'
import { cn } from '../../utils/cn'

interface Earth3DProps {
  satellites: SatelliteData[]
  debris: DebrisObject[]
  conjunctionEvents: ConjunctionEvent[]
  viewSettings: ViewSettings
  onSatelliteClick?: (satellite: SatelliteData) => void
  onDebrisClick?: (debris: DebrisObject) => void
  className?: string
}

// Earth component with texture and atmosphere
const Earth: React.FC<{ showAtmosphere: boolean; showOceans: boolean }> = ({ 
  showAtmosphere, 
  showOceans 
}) => {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001 // Slow rotation
    }
  })

  // Create earth texture (simplified - in production you'd load actual earth textures)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create a simple earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#87CEEB') // Sky blue
    gradient.addColorStop(0.3, '#228B22') // Forest green
    gradient.addColorStop(0.7, '#8B4513') // Saddle brown
    gradient.addColorStop(1, '#FFFFFF') // White (ice caps)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add some landmass-like patterns
    ctx.fillStyle = '#006400'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 30 + 10
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[6.371, 64, 32]}>
        <meshPhongMaterial 
          map={earthTexture}
          shininess={0.1}
          transparent={false}
        />
      </Sphere>
      
      {/* Atmosphere */}
      {showAtmosphere && (
        <Sphere ref={atmosphereRef} args={[6.5, 64, 32]}>
          <meshPhongMaterial 
            color="#87CEEB"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}

// Satellite component
const Satellite: React.FC<{
  satellite: SatelliteData
  onClick?: (satellite: SatelliteData) => void
}> = ({ satellite, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Convert lat/lon/alt to 3D coordinates
  const position = useMemo(() => {
    const { latitude, longitude, altitude_km } = satellite.position
    const radius = 6.371 + altitude_km / 1000 // Earth radius + altitude in Three.js units
    
    const phi = (90 - latitude) * (Math.PI / 180)
    const theta = (longitude + 180) * (Math.PI / 180)
    
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    
    return [x, y, z] as [number, number, number]
  }, [satellite.position])

  // Color based on operational status
  const color = useMemo(() => {
    switch (satellite.operational_status) {
      case 'OPERATIONAL': return '#00FF00'
      case 'DEGRADED': return '#FFFF00'
      case 'NON_OPERATIONAL': return '#FF0000'
      case 'DEORBITING': return '#FF8C00'
      default: return '#808080'
    }
  }, [satellite.operational_status])

  useFrame((state) => {
    if (meshRef.current) {
      // Simple orbital motion (simplified)
      const time = state.clock.getElapsedTime()
      const orbitSpeed = 0.001 // Adjust based on altitude
      meshRef.current.rotateY(orbitSpeed)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onClick?.(satellite)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.5 : 1}
    >
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={color} />
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-lg p-2 text-xs text-stellar-white max-w-48">
            <div className="font-semibold">{satellite.name}</div>
            <div className="text-neutral-400">{satellite.operator}</div>
            <div className="text-neutral-400">{satellite.mission_type}</div>
            <div className="text-neutral-400">Alt: {satellite.position.altitude_km.toFixed(0)} km</div>
            <div className={cn(
              "text-xs",
              satellite.operational_status === 'OPERATIONAL' && "text-green-400",
              satellite.operational_status === 'DEGRADED' && "text-yellow-400",
              satellite.operational_status === 'NON_OPERATIONAL' && "text-red-400"
            )}>
              {satellite.operational_status}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

// Debris component
const Debris: React.FC<{
  debris: DebrisObject
  onClick?: (debris: DebrisObject) => void
}> = ({ debris, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Convert lat/lon/alt to 3D coordinates
  const position = useMemo(() => {
    const { latitude, longitude, altitude_km } = debris.position
    const radius = 6.371 + altitude_km / 1000
    
    const phi = (90 - latitude) * (Math.PI / 180)
    const theta = (longitude + 180) * (Math.PI / 180)
    
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    
    return [x, y, z] as [number, number, number]
  }, [debris.position])

  // Color and size based on risk level and size
  const { color, size } = useMemo(() => {
    const riskColors = {
      CRITICAL: '#FF0000',
      HIGH: '#FF4500',
      MEDIUM: '#FFA500',
      LOW: '#FFFF00',
      NEGLIGIBLE: '#90EE90'
    }
    
    const baseSize = Math.max(0.005, Math.min(0.03, debris.estimated_size_cm / 1000))
    
    return {
      color: riskColors[debris.collision_risk_level],
      size: baseSize
    }
  }, [debris.collision_risk_level, debris.estimated_size_cm])

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onClick?.(debris)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 2 : 1}
    >
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-lg p-2 text-xs text-stellar-white max-w-48">
            <div className="font-semibold">Debris {debris.debris_id}</div>
            <div className="text-neutral-400">{debris.object_type.replace('_', ' ')}</div>
            <div className="text-neutral-400">Size: {debris.estimated_size_cm} cm</div>
            <div className="text-neutral-400">Alt: {debris.position.altitude_km.toFixed(0)} km</div>
            <div className={cn(
              "text-xs",
              debris.collision_risk_level === 'CRITICAL' && "text-red-400",
              debris.collision_risk_level === 'HIGH' && "text-orange-400",
              debris.collision_risk_level === 'MEDIUM' && "text-yellow-400",
              debris.collision_risk_level === 'LOW' && "text-green-400"
            )}>
              Risk: {debris.collision_risk_level}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

// Conjunction event visualization
const ConjunctionAlert: React.FC<{
  event: ConjunctionEvent
}> = ({ event }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // Convert lat/lon/alt to 3D coordinates
  const position = useMemo(() => {
    const { latitude, longitude, altitude_km } = event.position
    const radius = 6.371 + altitude_km / 1000
    
    const phi = (90 - latitude) * (Math.PI / 180)
    const theta = (longitude + 180) * (Math.PI / 180)
    
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    
    return [x, y, z] as [number, number, number]
  }, [event.position])

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation
      const time = state.clock.getElapsedTime()
      meshRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.3)
    }
  })

  const color = useMemo(() => {
    switch (event.risk_level) {
      case 'CRITICAL': return '#FF0000'
      case 'HIGH': return '#FF4500'
      case 'MEDIUM': return '#FFA500'
      default: return '#FFFF00'
    }
  }, [event.risk_level])

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.05, 0.1, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Camera controller
const CameraController: React.FC<{ viewSettings: ViewSettings }> = ({ viewSettings }) => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(
      viewSettings.cameraPosition.x,
      viewSettings.cameraPosition.y,
      viewSettings.cameraPosition.z
    )
  }, [camera, viewSettings.cameraPosition])

  return null
}

// Main Earth3D component
export const Earth3D: React.FC<Earth3DProps> = ({
  satellites,
  debris,
  conjunctionEvents,
  viewSettings,
  onSatelliteClick,
  onDebrisClick,
  className
}) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Canvas
        camera={{ 
          position: [viewSettings.cameraPosition.x, viewSettings.cameraPosition.y, viewSettings.cameraPosition.z],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#000011' }}
      >
        {/* Lighting */}
        <ambientLight intensity={viewSettings.ambientLightIntensity} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={viewSettings.directionalLightIntensity}
          castShadow
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        {/* Camera controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={50}
        />
        
        <CameraController viewSettings={viewSettings} />

        {/* Earth */}
        <Earth 
          showAtmosphere={viewSettings.showAtmosphere}
          showOceans={viewSettings.showOceans}
        />

        {/* Satellites */}
        {satellites.map((satellite) => (
          <Satellite
            key={satellite.id}
            satellite={satellite}
            onClick={onSatelliteClick}
          />
        ))}

        {/* Debris */}
        {debris.map((debrisItem) => (
          <Debris
            key={debrisItem.id}
            debris={debrisItem}
            onClick={onDebrisClick}
          />
        ))}

        {/* Conjunction events */}
        {conjunctionEvents.map((event) => (
          <ConjunctionAlert
            key={event.id}
            event={event}
          />
        ))}
      </Canvas>
    </div>
  )
}