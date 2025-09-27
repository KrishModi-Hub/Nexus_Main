import { useEffect, useRef, useState, useCallback } from 'react'

export interface SocketEvent {
  type: string
  data: any
  timestamp: string
}

export interface ConjunctionWarning {
  id: string
  primary_object_id: string
  secondary_object_id: string
  time_of_closest_approach: string
  miss_distance_km: number
  collision_probability: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface DebrisUpdate {
  id: string
  debris_id: string
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
  size_estimate_cm: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

interface UseSocketOptions {
  url?: string
  reconnectAttempts?: number
  reconnectInterval?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

interface UseSocketReturn {
  socket: WebSocket | null
  isConnected: boolean
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastEvent: SocketEvent | null
  conjunctionWarnings: ConjunctionWarning[]
  debrisUpdates: DebrisUpdate[]
  sendMessage: (message: any) => void
  clearWarnings: () => void
  clearDebrisUpdates: () => void
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const {
    url = 'ws://localhost:8080/ws',
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null)
  const [conjunctionWarnings, setConjunctionWarnings] = useState<ConjunctionWarning[]>([])
  const [debrisUpdates, setDebrisUpdates] = useState<DebrisUpdate[]>([])

  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionState('connecting')
    
    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setSocket(ws)
        setIsConnected(true)
        setConnectionState('connected')
        reconnectAttemptsRef.current = 0
        onConnect?.()
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setSocket(null)
        setIsConnected(false)
        setConnectionState('disconnected')
        onDisconnect?.()

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionState('error')
        onError?.(error)
      }

      ws.onmessage = (event) => {
        try {
          const socketEvent: SocketEvent = JSON.parse(event.data)
          setLastEvent(socketEvent)

          // Handle specific event types
          switch (socketEvent.type) {
            case 'conjunction:warning':
              const warning = socketEvent.data as ConjunctionWarning
              setConjunctionWarnings(prev => {
                // Remove existing warning with same ID and add new one
                const filtered = prev.filter(w => w.id !== warning.id)
                return [...filtered, warning].slice(-50) // Keep last 50 warnings
              })
              break

            case 'debris:update':
              const debris = socketEvent.data as DebrisUpdate
              setDebrisUpdates(prev => {
                // Remove existing debris with same ID and add new one
                const filtered = prev.filter(d => d.id !== debris.id)
                return [...filtered, debris].slice(-100) // Keep last 100 debris updates
              })
              break

            case 'satellite:position':
              // Handle satellite position updates if needed
              break

            default:
              console.log('Unhandled socket event:', socketEvent.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      setConnectionState('error')
    }
  }, [url, reconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError])

  const sendMessage = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message)
    }
  }, [socket])

  const clearWarnings = useCallback(() => {
    setConjunctionWarnings([])
  }, [])

  const clearDebrisUpdates = useCallback(() => {
    setDebrisUpdates([])
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        socket.close(1000, 'Component unmounting')
      }
    }
  }, [connect])

  return {
    socket,
    isConnected,
    connectionState,
    lastEvent,
    conjunctionWarnings,
    debrisUpdates,
    sendMessage,
    clearWarnings,
    clearDebrisUpdates
  }
}