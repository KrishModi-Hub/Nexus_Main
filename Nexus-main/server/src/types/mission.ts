export interface Mission {
  id: number;
  name: string;
  description?: string;
  mission_type: string;
  operator: string;
  target_orbital_shell_id?: number;
  satellite_configuration_id?: number;
  launch_vehicle_id?: number;
  planned_launch_date?: Date;
  mission_duration_years?: number;
  total_satellites: number;
  deployed_satellites: number;
  operational_satellites: number;
  total_cost_usd?: number;
  mission_status: MissionStatus;
  risk_assessment_score?: number;
  sustainability_commitments?: string[];
  regulatory_approvals?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export enum MissionStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  ACTIVE_DEPLOYMENT = 'ACTIVE_DEPLOYMENT',
  OPERATIONAL = 'OPERATIONAL',
  DECOMMISSIONING = 'DECOMMISSIONING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CreateMissionRequest {
  name: string;
  description?: string;
  mission_type: string;
  operator: string;
  target_orbital_shell_id?: number;
  satellite_configuration_id?: number;
  launch_vehicle_id?: number;
  planned_launch_date?: string;
  mission_duration_years?: number;
  total_satellites: number;
  total_cost_usd?: number;
  sustainability_commitments?: string[];
  regulatory_approvals?: Record<string, any>;
}

export interface UpdateMissionRequest {
  name?: string;
  description?: string;
  mission_type?: string;
  operator?: string;
  target_orbital_shell_id?: number;
  satellite_configuration_id?: number;
  launch_vehicle_id?: number;
  planned_launch_date?: string;
  mission_duration_years?: number;
  total_satellites?: number;
  deployed_satellites?: number;
  operational_satellites?: number;
  total_cost_usd?: number;
  mission_status?: MissionStatus;
  risk_assessment_score?: number;
  sustainability_commitments?: string[];
  regulatory_approvals?: Record<string, any>;
}

export interface MissionSimulationResult {
  mission_id: number;
  simulation_id: string;
  status: 'success' | 'failed';
  message: string;
  results?: {
    collision_risk_assessment: number;
    orbital_capacity_utilization: number;
    mission_success_probability: number;
    estimated_debris_generation: number;
  };
  timestamp: Date;
}

export interface MissionReport {
  mission_id: number;
  report_type: 'summary' | 'detailed' | 'financial' | 'risk';
  generated_at: Date;
  data: {
    mission_overview: {
      name: string;
      status: string;
      progress_percentage: number;
      satellites_deployed: number;
      satellites_operational: number;
    };
    financial_summary: {
      total_budget: number;
      spent_to_date: number;
      remaining_budget: number;
      cost_per_satellite: number;
    };
    risk_assessment: {
      overall_risk_score: number;
      collision_risk: number;
      technical_risk: number;
      regulatory_risk: number;
    };
    sustainability_metrics: {
      debris_mitigation_score: number;
      end_of_life_planning: number;
      environmental_impact: number;
    };
  };
}

export interface MissionOptimizationResult {
  mission_id: number;
  optimization_id: string;
  status: 'success' | 'failed';
  message: string;
  recommendations?: {
    optimal_launch_window: {
      start_date: Date;
      end_date: Date;
      cost_savings_usd: number;
    };
    satellite_configuration: {
      recommended_config_id: number;
      efficiency_improvement: number;
      cost_impact_usd: number;
    };
    orbital_shell: {
      recommended_shell_id: number;
      collision_risk_reduction: number;
      capacity_utilization: number;
    };
    launch_vehicle: {
      recommended_vehicle_id: number;
      cost_savings_usd: number;
      reliability_improvement: number;
    };
  };
  timestamp: Date;
}