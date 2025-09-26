export interface CollisionRiskRequest {
  altitude_km: number;
  inclination_deg: number;
  satellite_count: number;
  mission_duration_years: number;
  collision_avoidance_capability?: boolean;
  satellite_size_category?: 'SMALL' | 'MEDIUM' | 'LARGE';
}

export interface CollisionRiskResponse {
  risk_assessment_id: string;
  overall_collision_probability: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  contributing_factors: {
    debris_density_score: number;
    traffic_density_score: number;
    altitude_risk_score: number;
    mission_duration_impact: number;
  };
  mitigation_recommendations: string[];
  confidence_level: number;
  assessment_timestamp: Date;
}

export interface DebrisDensityResponse {
  altitude_km: number;
  debris_density_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tracked_objects_count: number;
  estimated_untracked_objects: number;
  collision_events_last_year: number;
  risk_factors: {
    large_debris_count: number;
    small_debris_estimated: number;
    active_satellites_count: number;
    recent_breakup_events: number;
  };
  historical_trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
}

export interface DeorbitAnalysisRequest {
  satellite_mass_kg: number;
  orbital_altitude_km: number;
  satellite_area_m2?: number;
  propulsion_capability?: boolean;
  target_deorbit_timeline_years?: number;
}

export interface DeorbitAnalysisResponse {
  analysis_id: string;
  natural_decay_timeline_years: number;
  controlled_deorbit_feasible: boolean;
  deorbit_options: {
    option_type: 'NATURAL_DECAY' | 'CONTROLLED_DEORBIT' | 'GRAVEYARD_ORBIT';
    timeline_years: number;
    cost_estimate_usd: number;
    success_probability: number;
    environmental_impact_score: number;
  }[];
  recommended_option: string;
  compliance_status: {
    fcc_25_year_rule: boolean;
    iadc_guidelines: boolean;
    iso_24113_standard: boolean;
  };
  sustainability_score: number;
}