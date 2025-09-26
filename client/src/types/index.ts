export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export type InputVariant = 'default' | 'error' | 'success'
export type InputSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T | string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

export interface Mission {
  id: number
  name: string
  description?: string
  mission_type: string
  operator: string
  target_orbital_shell_id?: number
  satellite_configuration_id?: number
  launch_vehicle_id?: number
  planned_launch_date?: string
  mission_duration_years?: number
  total_satellites: number
  deployed_satellites: number
  operational_satellites: number
  total_cost_usd?: number
  mission_status: 'PLANNING' | 'APPROVED' | 'ACTIVE_DEPLOYMENT' | 'OPERATIONAL' | 'DECOMMISSIONING' | 'COMPLETED' | 'CANCELLED'
  risk_assessment_score?: number
  sustainability_commitments?: string[]
  regulatory_approvals?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CostEstimate {
  total_cost_usd: number
  cost_breakdown: {
    development: number
    manufacturing: number
    launch: number
    operations: number
    insurance: number
    deorbit: number
    regulatory: number
  }
  cost_per_satellite_usd: number
  uncertainty_range: {
    min_cost_usd: number
    max_cost_usd: number
  }
  assumptions: string[]
  confidence_level: number
}

export interface SustainabilityReport {
  risk_assessment_id: string
  overall_collision_probability: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  contributing_factors: {
    debris_density_score: number
    traffic_density_score: number
    altitude_risk_score: number
    mission_duration_impact: number
  }
  mitigation_recommendations: string[]
  confidence_level: number
  assessment_timestamp: string
}