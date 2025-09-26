export interface MissionFormData {
  // Basic Information
  name: string
  description: string
  mission_type: string
  operator: string
  
  // Technical Specifications
  total_satellites: number
  satellite_mass_kg: number
  satellite_size_category: 'SMALL' | 'MEDIUM' | 'LARGE'
  orbital_altitude_km: number
  inclination_deg: number
  mission_duration_years: number
  
  // Launch Configuration
  launch_vehicle_type: string
  planned_launch_date: string
  collision_avoidance_capability: boolean
  
  // Financial Parameters
  total_cost_usd: number
  insurance_coverage_required: boolean
  cost_categories: string[]
  
  // Sustainability
  sustainability_commitments: string[]
  regulatory_approvals: Record<string, any>
}

export interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<WizardStepProps>
  isValid: (data: Partial<MissionFormData>) => boolean
}

export interface WizardStepProps {
  data: Partial<MissionFormData>
  onUpdate: (updates: Partial<MissionFormData>) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export interface FinancialChartData {
  cashFlow: {
    month: number
    income: number
    expenses: number
    netCashFlow: number
    cumulativeCashFlow: number
  }[]
  
  breakEven: {
    month: number
    revenue: number
    costs: number
    profit: number
  }[]
  
  roi: {
    year: number
    investment: number
    returns: number
    roi: number
    cumulativeROI: number
  }[]
  
  costBreakdown: {
    category: string
    amount: number
    percentage: number
    color: string
  }[]
}

export interface MissionAnalysisResult {
  mission: any
  costEstimate: any
  collisionRisk: any
  optimization: any
  financialProjection: FinancialChartData
}