import React from 'react'
import { cn } from '../../utils/cn'
import type { ButtonVariant, ButtonSize } from '../../types'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-electric-blue hover:bg-electric-blue/90 text-deep-space-black font-medium shadow-glow hover:shadow-glow-lg transition-all duration-200',
  secondary: 'bg-cosmic-purple hover:bg-cosmic-purple/90 text-stellar-white font-medium shadow-lg hover:shadow-xl transition-all duration-200',
  success: 'bg-green-600 hover:bg-green-700 text-stellar-white font-medium shadow-lg hover:shadow-xl transition-all duration-200',
  warning: 'bg-solar-orange hover:bg-solar-orange/90 text-deep-space-black font-medium shadow-lg hover:shadow-xl transition-all duration-200',
  danger: 'bg-red-600 hover:bg-red-700 text-stellar-white font-medium shadow-lg hover:shadow-xl transition-all duration-200',
  ghost: 'bg-transparent hover:bg-white/10 text-stellar-white border border-white/20 hover:border-white/40 transition-all duration-200',
  outline: 'bg-transparent hover:bg-electric-blue/10 text-electric-blue border border-electric-blue hover:border-electric-blue/80 transition-all duration-200',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
  xl: 'px-8 py-4 text-xl rounded-xl',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-space focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}