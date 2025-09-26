import { Pool, PoolClient } from 'pg';
import pool from '../config/database';
import { 
  CostComponent, 
  InsuranceModel, 
  CostEstimateRequest, 
  CostEstimateResponse, 
  InsuranceQuoteRequest, 
  InsuranceQuoteResponse 
} from '../types/cost';

export class CostService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async getCostComponents(): Promise<CostComponent[]> {
    const query = `
      SELECT * FROM cost_components 
      ORDER BY component_category, component_name
    `;
    
    const result = await this.pool.query(query);
    return result.rows.map(this.mapRowToCostComponent);
  }

  async generateCostEstimate(request: CostEstimateRequest): Promise<CostEstimateResponse> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Get relevant cost components
      const componentsQuery = `
        SELECT * FROM cost_components 
        WHERE ($1::text[] IS NULL OR component_category = ANY($1::text[]))
        AND ($2::text[] IS NULL OR applicable_mission_types && $2::text[])
      `;
      
      const categoryFilter = request.cost_categories || null;
      const missionTypeFilter = [request.mission_type];
      
      const componentsResult = await client.query(componentsQuery, [categoryFilter, missionTypeFilter]);
      const components = componentsResult.rows.map(this.mapRowToCostComponent);

      // Calculate costs by category
      const costBreakdown = {
        development: 0,
        manufacturing: 0,
        launch: 0,
        operations: 0,
        insurance: 0,
        deorbit: 0,
        regulatory: 0
      };

      let totalUncertainty = 0;
      let weightedConfidence = 0;
      let totalWeight = 0;
      const assumptions: string[] = [];

      for (const component of components) {
        const categoryKey = component.component_category.toLowerCase() as keyof typeof costBreakdown;
        
        if (costBreakdown.hasOwnProperty(categoryKey)) {
          // Apply scaling based on satellite count
          let scaledCost = component.base_cost_usd;
          
          if (component.cost_per_unit && request.satellite_count > 1) {
            const additionalUnits = request.satellite_count - 1;
            const scalingFactor = Math.pow(component.cost_scaling_factor, Math.log(additionalUnits + 1));
            scaledCost += component.cost_per_unit * additionalUnits * scalingFactor;
          }

          // Apply mission-specific adjustments
          if (request.mission_duration_years && categoryKey === 'operations') {
            scaledCost *= request.mission_duration_years;
          }

          if (request.satellite_mass_kg && (categoryKey === 'manufacturing' || categoryKey === 'launch')) {
            const massMultiplier = Math.max(0.5, Math.min(2.0, request.satellite_mass_kg / 500)); // Normalize around 500kg
            scaledCost *= massMultiplier;
          }

          costBreakdown[categoryKey] += scaledCost;
          
          // Track uncertainty and confidence
          if (component.cost_uncertainty_percentage) {
            totalUncertainty += (scaledCost * component.cost_uncertainty_percentage / 100);
          }
          
          if (component.confidence_level) {
            weightedConfidence += component.confidence_level * scaledCost;
            totalWeight += scaledCost;
          }

          assumptions.push(`${component.component_name}: Based on ${component.confidence_level ? Math.round(component.confidence_level * 100) + '% confidence' : 'industry estimates'}`);
        }
      }

      // Handle insurance if required
      if (request.insurance_coverage_required) {
        const insuranceEstimate = await this.estimateInsuranceCost(request, client);
        costBreakdown.insurance += insuranceEstimate;
      }

      const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);
      const costPerSatellite = totalCost / request.satellite_count;
      const overallConfidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0.75;

      // Calculate uncertainty range
      const uncertaintyAmount = totalUncertainty || totalCost * 0.15; // Default 15% uncertainty
      const minCost = Math.max(0, totalCost - uncertaintyAmount);
      const maxCost = totalCost + uncertaintyAmount;

      return {
        total_cost_usd: Math.round(totalCost),
        cost_breakdown: {
          development: Math.round(costBreakdown.development),
          manufacturing: Math.round(costBreakdown.manufacturing),
          launch: Math.round(costBreakdown.launch),
          operations: Math.round(costBreakdown.operations),
          insurance: Math.round(costBreakdown.insurance),
          deorbit: Math.round(costBreakdown.deorbit),
          regulatory: Math.round(costBreakdown.regulatory)
        },
        cost_per_satellite_usd: Math.round(costPerSatellite),
        uncertainty_range: {
          min_cost_usd: Math.round(minCost),
          max_cost_usd: Math.round(maxCost)
        },
        assumptions,
        confidence_level: Math.round(overallConfidence * 100) / 100
      };

    } finally {
      client.release();
    }
  }

  async generateInsuranceQuote(request: InsuranceQuoteRequest): Promise<InsuranceQuoteResponse> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Find matching insurance models
      const modelsQuery = `
        SELECT * FROM insurance_models 
        WHERE coverage_type = $1 
        AND active_status = true
        AND ($2 >= minimum_satellite_value_usd OR minimum_satellite_value_usd IS NULL)
        AND ($2 <= maximum_satellite_value_usd OR maximum_satellite_value_usd IS NULL)
        ORDER BY base_premium_rate ASC
        LIMIT 1
      `;
      
      const modelsResult = await client.query(modelsQuery, [request.coverage_type, request.satellite_value_usd]);
      
      if (modelsResult.rows.length === 0) {
        throw new Error(`No insurance model found for coverage type ${request.coverage_type} and satellite value $${request.satellite_value_usd}`);
      }

      const model = this.mapRowToInsuranceModel(modelsResult.rows[0]);
      
      // Calculate premium with risk adjustments
      let adjustedPremiumRate = model.base_premium_rate;
      const riskAdjustments: Record<string, number> = {};

      // Apply altitude-based risk adjustment
      if (request.orbital_altitude_km) {
        if (request.orbital_altitude_km < 600) {
          riskAdjustments.altitude_risk = 1.2; // Higher risk in LEO
          adjustedPremiumRate *= 1.2;
        } else if (request.orbital_altitude_km > 20000) {
          riskAdjustments.altitude_risk = 0.9; // Lower risk in higher orbits
          adjustedPremiumRate *= 0.9;
        }
      }

      // Apply collision avoidance capability adjustment
      if (request.collision_avoidance_capability === true) {
        riskAdjustments.collision_avoidance = 0.85;
        adjustedPremiumRate *= 0.85;
      } else if (request.collision_avoidance_capability === false) {
        riskAdjustments.collision_avoidance = 1.15;
        adjustedPremiumRate *= 1.15;
      }

      // Apply launch vehicle risk adjustment
      if (request.launch_vehicle_type) {
        const reliableVehicles = ['Falcon 9', 'Atlas V', 'Ariane 5'];
        if (reliableVehicles.includes(request.launch_vehicle_type)) {
          riskAdjustments.launch_vehicle = 0.95;
          adjustedPremiumRate *= 0.95;
        }
      }

      // Calculate final premium
      const annualPremium = request.satellite_value_usd * adjustedPremiumRate;
      const totalPremium = (annualPremium * request.mission_duration_months) / 12;

      const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

      return {
        quote_id: quoteId,
        coverage_type: request.coverage_type,
        premium_usd: Math.round(totalPremium),
        coverage_amount_usd: model.coverage_amount_usd,
        deductible_usd: model.deductible_usd,
        policy_duration_months: request.mission_duration_months,
        premium_rate: Math.round(adjustedPremiumRate * 10000) / 10000, // Round to 4 decimal places
        risk_adjustments: riskAdjustments,
        exclusions: model.exclusions || [],
        valid_until: validUntil
      };

    } finally {
      client.release();
    }
  }

  private async estimateInsuranceCost(request: CostEstimateRequest, client: PoolClient): Promise<number> {
    // Simple insurance cost estimation
    const satelliteValue = request.satellite_count * 5000000; // Assume $5M per satellite
    const basePremiumRate = 0.08; // 8% base rate
    const missionDurationMonths = (request.mission_duration_years || 5) * 12;
    
    return (satelliteValue * basePremiumRate * missionDurationMonths) / 12;
  }

  private mapRowToCostComponent(row: any): CostComponent {
    return {
      id: row.id,
      component_name: row.component_name,
      component_category: row.component_category,
      base_cost_usd: parseFloat(row.base_cost_usd),
      cost_per_unit: row.cost_per_unit ? parseFloat(row.cost_per_unit) : undefined,
      cost_scaling_factor: parseFloat(row.cost_scaling_factor),
      cost_uncertainty_percentage: row.cost_uncertainty_percentage ? parseFloat(row.cost_uncertainty_percentage) : undefined,
      cost_drivers: row.cost_drivers || [],
      applicable_mission_types: row.applicable_mission_types || [],
      confidence_level: row.confidence_level ? parseFloat(row.confidence_level) : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapRowToInsuranceModel(row: any): InsuranceModel {
    return {
      id: row.id,
      model_name: row.model_name,
      coverage_type: row.coverage_type,
      base_premium_rate: parseFloat(row.base_premium_rate),
      coverage_amount_usd: parseFloat(row.coverage_amount_usd),
      deductible_usd: parseFloat(row.deductible_usd),
      policy_duration_months: row.policy_duration_months,
      risk_factors: row.risk_factors || {},
      premium_adjustments: row.premium_adjustments || {},
      exclusions: row.exclusions || [],
      minimum_satellite_value_usd: row.minimum_satellite_value_usd ? parseFloat(row.minimum_satellite_value_usd) : undefined,
      maximum_satellite_value_usd: row.maximum_satellite_value_usd ? parseFloat(row.maximum_satellite_value_usd) : undefined,
      active_status: row.active_status,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

export default new CostService();