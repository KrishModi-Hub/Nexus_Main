export interface CostComponent {
  id: number;
  component_name: string;
  component_category: string;
  base_cost_usd: number;
  cost_per_unit?: number;
  cost_scaling_factor: number;
  cost_uncertainty_percentage?: number;
  cost_drivers?: string[];
  applicable_mission_types?: string[];
  confidence_level?: number;
  created_at: Date;
  updated_at: Date;
}

export interface InsuranceModel {
  id: number;
  model_name: string;
  coverage_type: string;
  base_premium_rate: number;
  coverage_amount_usd: number;
  deductible_usd: number;
  policy_duration_months: number;
  risk_factors?: Record<string, any>;
  premium_adjustments?: Record<string, any>;
  exclusions?: string[];
  minimum_satellite_value_usd?: number;
  maximum_satellite_value_usd?: number;
  active_status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CostEstimateRequest {
  mission_type: string;
  satellite_count: number;
  satellite_mass_kg?: number;
  mission_duration_years?: number;
  orbital_altitude_km?: number;
  launch_vehicle_type?: string;
  insurance_coverage_required?: boolean;
  cost_categories?: string[];
}

export interface CostEstimateResponse {
  total_cost_usd: number;
  cost_breakdown: {
    development: number;
    manufacturing: number;
    launch: number;
    operations: number;
    insurance: number;
    deorbit: number;
    regulatory: number;
  };
  cost_per_satellite_usd: number;
  uncertainty_range: {
    min_cost_usd: number;
    max_cost_usd: number;
  };
  assumptions: string[];
  confidence_level: number;
}

export interface InsuranceQuoteRequest {
  coverage_type: string;
  satellite_value_usd: number;
  mission_duration_months: number;
  orbital_altitude_km?: number;
  launch_vehicle_type?: string;
  collision_avoidance_capability?: boolean;
}

export interface InsuranceQuoteResponse {
  quote_id: string;
  coverage_type: string;
  premium_usd: number;
  coverage_amount_usd: number;
  deductible_usd: number;
  policy_duration_months: number;
  premium_rate: number;
  risk_adjustments: Record<string, number>;
  exclusions: string[];
  valid_until: Date;
}