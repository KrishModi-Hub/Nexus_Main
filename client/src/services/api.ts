import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { 
  Mission, 
  CostEstimate, 
  SustainabilityReport,
  ApiResponse,
  PaginatedResponse 
} from '../types'

// Mission-related types
export interface CreateMissionRequest {
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
  total_cost_usd?: number
  sustainability_commitments?: string[]
  regulatory_approvals?: Record<string, any>
}

export interface UpdateMissionRequest extends Partial<CreateMissionRequest> {
  deployed_satellites?: number
  operational_satellites?: number
  mission_status?: string
  risk_assessment_score?: number
}

export interface MissionSimulationResult {
  mission_id: number
  simulation_id: string
  status: 'success' | 'failed'
  message: string
  results?: {
    collision_risk_assessment: number
    orbital_capacity_utilization: number
    mission_success_probability: number
    estimated_debris_generation: number
  }
  timestamp: string
}

export interface MissionReport {
  mission_id: number
  report_type: 'summary' | 'detailed' | 'financial' | 'risk'
  generated_at: string
  data: {
    mission_overview: {
      name: string
      status: string
      progress_percentage: number
      satellites_deployed: number
      satellites_operational: number
    }
    financial_summary: {
      total_budget: number
      spent_to_date: number
      remaining_budget: number
      cost_per_satellite: number
    }
    risk_assessment: {
      overall_risk_score: number
      collision_risk: number
      technical_risk: number
      regulatory_risk: number
    }
    sustainability_metrics: {
      debris_mitigation_score: number
      end_of_life_planning: number
      environmental_impact: number
    }
  }
}

export interface MissionOptimizationResult {
  mission_id: number
  optimization_id: string
  status: 'success' | 'failed'
  message: string
  recommendations?: {
    optimal_launch_window: {
      start_date: string
      end_date: string
      cost_savings_usd: number
    }
    satellite_configuration: {
      recommended_config_id: number
      efficiency_improvement: number
      cost_impact_usd: number
    }
    orbital_shell: {
      recommended_shell_id: number
      collision_risk_reduction: number
      capacity_utilization: number
    }
    launch_vehicle: {
      recommended_vehicle_id: number
      cost_savings_usd: number
      reliability_improvement: number
    }
  }
  timestamp: string
}

// Cost Calculator types
export interface CostEstimateRequest {
  mission_type: string
  satellite_count: number
  satellite_mass_kg?: number
  mission_duration_years?: number
  orbital_altitude_km?: number
  launch_vehicle_type?: string
  insurance_coverage_required?: boolean
  cost_categories?: string[]
}

export interface CostComponent {
  id: number
  component_name: string
  component_category: string
  base_cost_usd: number
  cost_per_unit?: number
  cost_scaling_factor: number
  cost_uncertainty_percentage?: number
  cost_drivers?: string[]
  applicable_mission_types?: string[]
  confidence_level?: number
  created_at: string
  updated_at: string
}

export interface InsuranceQuoteRequest {
  coverage_type: string
  satellite_value_usd: number
  mission_duration_months: number
  orbital_altitude_km?: number
  launch_vehicle_type?: string
  collision_avoidance_capability?: boolean
}

export interface InsuranceQuoteResponse {
  quote_id: string
  coverage_type: string
  premium_usd: number
  coverage_amount_usd: number
  deductible_usd: number
  policy_duration_months: number
  premium_rate: number
  risk_adjustments: Record<string, number>
  exclusions: string[]
  valid_until: string
}

// Sustainability types
export interface CollisionRiskRequest {
  altitude_km: number
  inclination_deg: number
  satellite_count: number
  mission_duration_years: number
  collision_avoidance_capability?: boolean
  satellite_size_category?: 'SMALL' | 'MEDIUM' | 'LARGE'
}

export interface CollisionRiskResponse {
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

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Mission', 'CostEstimate', 'SustainabilityReport', 'CostComponent'],
  endpoints: (builder) => ({
    // Health check endpoint
    getHealth: builder.query<ApiResponse<{ message: string; timestamp: string; version: string; environment: string }>, void>({
      query: () => '/health',
    }),

    // Mission endpoints
    createMission: builder.mutation<ApiResponse<Mission>, CreateMissionRequest>({
      query: (missionData) => ({
        url: '/missions/create',
        method: 'POST',
        body: missionData,
      }),
      invalidatesTags: ['Mission'],
    }),

    getMissionById: builder.query<ApiResponse<Mission>, number>({
      query: (id) => `/missions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Mission', id }],
    }),

    updateMission: builder.mutation<ApiResponse<Mission>, { id: number; data: UpdateMissionRequest }>({
      query: ({ id, data }) => ({
        url: `/missions/${id}/update`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Mission', id }],
    }),

    deleteMission: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/missions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mission'],
    }),

    simulateMission: builder.mutation<ApiResponse<MissionSimulationResult>, number>({
      query: (id) => ({
        url: `/missions/${id}/simulate`,
        method: 'POST',
      }),
    }),

    generateMissionReport: builder.query<ApiResponse<MissionReport>, number>({
      query: (id) => `/missions/${id}/report`,
    }),

    optimizeMission: builder.mutation<ApiResponse<MissionOptimizationResult>, number>({
      query: (id) => ({
        url: `/missions/${id}/optimize`,
        method: 'POST',
      }),
    }),

    // Cost Calculator endpoints
    generateCostEstimate: builder.mutation<ApiResponse<CostEstimate>, CostEstimateRequest>({
      query: (estimateData) => ({
        url: '/calculator/estimate',
        method: 'POST',
        body: estimateData,
      }),
      invalidatesTags: ['CostEstimate'],
    }),

    getCostComponents: builder.query<ApiResponse<{ components: CostComponent[]; total_count: number }>, void>({
      query: () => '/calculator/components',
      providesTags: ['CostComponent'],
    }),

    generateInsuranceQuote: builder.mutation<ApiResponse<InsuranceQuoteResponse>, InsuranceQuoteRequest>({
      query: (quoteData) => ({
        url: '/calculator/insurance-quote',
        method: 'POST',
        body: quoteData,
      }),
    }),

    // Sustainability endpoints
    assessCollisionRisk: builder.mutation<ApiResponse<CollisionRiskResponse>, CollisionRiskRequest>({
      query: (riskData) => ({
        url: '/sustainability/collision-risk',
        method: 'POST',
        body: riskData,
      }),
      invalidatesTags: ['SustainabilityReport'],
    }),

    getDebrisDensity: builder.query<ApiResponse<any>, number>({
      query: (altitude) => `/sustainability/debris-density/${altitude}`,
    }),

    analyzeDeorbitOptions: builder.mutation<ApiResponse<any>, any>({
      query: (analysisData) => ({
        url: '/sustainability/deorbit-analysis',
        method: 'POST',
        body: analysisData,
      }),
    }),

    getActiveSatellites: builder.query<ApiResponse<any[]>, void>({
      query: () => '/sustainability/active-satellites',
    }),
  }),
})

export const {
  useGetHealthQuery,
  useCreateMissionMutation,
  useGetMissionByIdQuery,
  useUpdateMissionMutation,
  useDeleteMissionMutation,
  useSimulateMissionMutation,
  useGenerateMissionReportQuery,
  useOptimizeMissionMutation,
  useGenerateCostEstimateMutation,
  useGetCostComponentsQuery,
  useGenerateInsuranceQuoteMutation,
  useAssessCollisionRiskMutation,
  useGetDebrisDensityQuery,
  useAnalyzeDeorbitOptionsMutation,
} = apiSlice