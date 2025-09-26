import React from 'react'
import { cn } from '../../utils/cn'
import type { InputVariant, InputSize } from '../../types'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
  inputSize?: InputSize
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const inputVariants: Record<InputVariant, string> = {
  default: 'border-neutral-700 bg-neutral-900/50 text-stellar-white placeholder-neutral-500 focus:border-electric-blue focus:ring-electric-blue/20',
  error: 'border-red-500 bg-neutral-900/50 text-stellar-white placeholder-neutral-500 focus:border-red-500 focus:ring-red-500/20',
  success: 'border-green-500 bg-neutral-900/50 text-stellar-white placeholder-neutral-500 focus:border-green-500 focus:ring-green-500/20',
}

const inputSizes: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-4 py-3 text-lg rounded-lg',
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  inputSize = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const hasError = Boolean(error)
  const actualVariant = hasError ? 'error' : variant

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-stellar-white font-inter"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-neutral-500">{leftIcon}</div>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block border transition-colors duration-200 font-inter',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            inputVariants[actualVariant],
            inputSizes[inputSize],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-neutral-500">{rightIcon}</div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p
          className={cn(
            'text-sm font-inter',
            hasError ? 'text-red-400' : 'text-neutral-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant
  inputSize?: InputSize
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
  variant = 'default',
  inputSize = 'md',
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const hasError = Boolean(error)
  const actualVariant = hasError ? 'error' : variant

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-stellar-white font-inter"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={inputId}
        className={cn(
          'block border transition-colors duration-200 font-inter resize-vertical',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputVariants[actualVariant],
          inputSizes[inputSize],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <p
          className={cn(
            'text-sm font-inter',
            hasError ? 'text-red-400' : 'text-neutral-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}