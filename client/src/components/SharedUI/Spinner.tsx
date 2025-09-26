import React from 'react'
import { cn } from '../../utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'current'
  className?: string
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const spinnerColors = {
  primary: 'border-electric-blue',
  secondary: 'border-cosmic-purple',
  white: 'border-stellar-white',
  current: 'border-current',
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        spinnerSizes[size],
        spinnerColors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children,
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <Spinner size="lg" color="primary" />
            <p className="text-stellar-white font-inter text-sm">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface PulseSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const PulseSpinner: React.FC<PulseSpinnerProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-electric-blue rounded-full animate-pulse',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  )
}

interface OrbitSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const OrbitSpinner: React.FC<OrbitSpinnerProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-electric-blue/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-electric-blue animate-spin" />
      <div className="absolute inset-2 rounded-full border-2 border-cosmic-purple/20" />
      <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cosmic-purple animate-spin-slow" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1 w-1 bg-electric-blue rounded-full animate-pulse" />
      </div>
    </div>
  )
}