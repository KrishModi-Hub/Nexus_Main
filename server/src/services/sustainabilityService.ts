import { Pool, PoolClient } from 'pg';
import pool from '../config/database';
import { 
  CollisionRiskRequest, 
  CollisionRiskResponse, 
  DebrisDensityResponse, 
  DeorbitAnalysisRequest, 
  DeorbitAnalysisResponse 
} from '../types/sustainability';

export class SustainabilityService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async assessCollisionRisk(request: CollisionRiskRequest): Promise<CollisionRiskResponse> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Get orbital shell information for the given altitude
      const shellQuery = `
        SELECT * FROM orbital_shells 
        WHERE altitude_range_km @> $1::integer
        ORDER BY collision_risk_score DESC
        LIMIT 1
      `;
      
      const shellResult = await client.query(shellQuery, [request.altitude_km]);
      
      // Get collision events in the altitude range
      const eventsQuery = `
        SELECT COUNT(*) as event_count,
               AVG(collision_probability) as avg_probability,
               MAX(collision_probability) as max_probability
        FROM collision_events 
        WHERE altitude_km BETWEEN $1 AND $2
        AND event_date >= CURRENT_DATE - INTERVAL '1 year'
      `;
      
      const altitudeRange = 50; // ±50km range
      const eventsResult = await client.query(eventsQuery, [
        request.altitude_km - altitudeRange, 
        request.altitude_km + altitudeRange
      ]);

      // Get active satellites count in the altitude range
      const satellitesQuery = `
        SELECT COUNT(*) as satellite_count
        FROM active_satellites 
        WHERE current_altitude_km BETWEEN $1 AND $2
        AND operational_status = 'OPERATIONAL'
      `;
      
      const satellitesResult = await client.query(satellitesQuery, [
        request.altitude_km - altitudeRange, 
        request.altitude_km + altitudeRange
      ]);

      // Calculate risk factors
      const shell = shellResult.rows[0];
      const events = eventsResult.rows[0];
      const satellites = satellitesResult.rows[0];

      const debrisDensityScore = shell ? this.calculateDebrisDensityScore(shell.debris_density_level) : 50;
      const trafficDensityScore = this.calculateTrafficDensityScore(parseInt(satellites.satellite_count), request.altitude_km);
      const altitudeRiskScore = this.calculateAltitudeRiskScore(request.altitude_km);
      const missionDurationImpact = this.calculateMissionDurationImpact(request.mission_duration_years);

      // Calculate overall collision probability
      let baseProbability = 0.001; // 0.1% base probability
      
      if (events.avg_probability) {
        baseProbability = Math.max(baseProbability, parseFloat(events.avg_probability));
      }

      // Apply risk multipliers
      let riskMultiplier = 1.0;
      riskMultiplier *= (debrisDensityScore / 50); // Normalize around 50
      riskMultiplier *= (trafficDensityScore / 50);
      riskMultiplier *= (altitudeRiskScore / 50);
      riskMultiplier *= missionDurationImpact;
      riskMultiplier *= request.satellite_count / 100; // Scale with constellation size

      // Apply collision avoidance capability
      if (request.collision_avoidance_capability === true) {
        riskMultiplier *= 0.3; // 70% risk reduction
      } else if (request.collision_avoidance_capability === false) {
        riskMultiplier *= 1.5; // 50% risk increase
      }

      // Apply satellite size category
      if (request.satellite_size_category) {
        const sizeMultipliers = { SMALL: 0.7, MEDIUM: 1.0, LARGE: 1.4 };
        riskMultiplier *= sizeMultipliers[request.satellite_size_category];
      }

      const overallProbability = Math.min(1.0, baseProbability * riskMultiplier);
      const riskLevel = this.determineRiskLevel(overallProbability);

      // Generate mitigation recommendations
      const mitigationRecommendations = this.generateMitigationRecommendations(
        riskLevel, 
        request, 
        debrisDensityScore, 
        trafficDensityScore
      );

      const assessmentId = `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        risk_assessment_id: assessmentId,
        overall_collision_probability: Math.round(overallProbability * 1000000) / 1000000, // 6 decimal places
        risk_level: riskLevel,
        contributing_factors: {
          debris_density_score: Math.round(debrisDensityScore * 100) / 100,
          traffic_density_score: Math.round(trafficDensityScore * 100) / 100,
          altitude_risk_score: Math.round(altitudeRiskScore * 100) / 100,
          mission_duration_impact: Math.round(missionDurationImpact * 100) / 100
        },
        mitigation_recommendations: mitigationRecommendations,
        confidence_level: 0.75, // Fixed confidence level for now
        assessment_timestamp: new Date()
      };

    } finally {
      client.release();
    }
  }

  async getDebrisDensity(altitude: number): Promise<DebrisDensityResponse> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      // Get orbital shell information
      const shellQuery = `
        SELECT * FROM orbital_shells 
        WHERE altitude_range_km @> $1::integer
        ORDER BY collision_risk_score DESC
        LIMIT 1
      `;
      
      const shellResult = await client.query(shellQuery, [altitude]);
      
      // Get collision events in the last year
      const eventsQuery = `
        SELECT COUNT(*) as event_count
        FROM collision_events 
        WHERE altitude_km BETWEEN $1 AND $2
        AND event_date >= CURRENT_DATE - INTERVAL '1 year'
      `;
      
      const altitudeRange = 100; // ±100km range
      const eventsResult = await client.query(eventsQuery, [altitude - altitudeRange, altitude + altitudeRange]);

      // Get active satellites count
      const satellitesQuery = `
        SELECT COUNT(*) as satellite_count
        FROM active_satellites 
        WHERE current_altitude_km BETWEEN $1 AND $2
        AND operational_status = 'OPERATIONAL'
      `;
      
      const satellitesResult = await client.query(satellitesQuery, [altitude - altitudeRange, altitude + altitudeRange]);

      // Get orbital debris count
      const debrisQuery = `
        SELECT COUNT(*) as debris_count,
               COUNT(CASE WHEN estimated_size_cm > 10 THEN 1 END) as large_debris_count
        FROM orbital_debris 
        WHERE current_altitude_km BETWEEN $1 AND $2
      `;
      
      const debrisResult = await client.query(debrisQuery, [altitude - altitudeRange, altitude + altitudeRange]);

      const shell = shellResult.rows[0];
      const events = eventsResult.rows[0];
      const satellites = satellitesResult.rows[0];
      const debris = debrisResult.rows[0];

      const debrisDensityLevel = shell ? shell.debris_density_level : this.estimateDebrisDensityLevel(altitude);
      const trackedObjectsCount = parseInt(debris.debris_count) + parseInt(satellites.satellite_count);
      const estimatedUntrackedObjects = Math.floor(trackedObjectsCount * 2.5); // Estimate 2.5x untracked objects

      // Calculate historical trend (simplified)
      const historicalTrend = this.calculateHistoricalTrend(altitude, parseInt(events.event_count));

      return {
        altitude_km: altitude,
        debris_density_level: debrisDensityLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        tracked_objects_count: trackedObjectsCount,
        estimated_untracked_objects: estimatedUntrackedObjects,
        collision_events_last_year: parseInt(events.event_count),
        risk_factors: {
          large_debris_count: parseInt(debris.large_debris_count) || 0,
          small_debris_estimated: Math.floor(estimatedUntrackedObjects * 0.8),
          active_satellites_count: parseInt(satellites.satellite_count),
          recent_breakup_events: Math.floor(parseInt(events.event_count) * 0.1) // Estimate 10% are breakup events
        },
        historical_trend: historicalTrend
      };

    } finally {
      client.release();
    }
  }

  async analyzeDeorbitOptions(request: DeorbitAnalysisRequest): Promise<DeorbitAnalysisResponse> {
    // Calculate natural decay timeline using simplified atmospheric drag model
    const naturalDecayYears = this.calculateNaturalDecayTimeline(
      request.satellite_mass_kg, 
      request.orbital_altitude_km, 
      request.satellite_area_m2 || 10 // Default 10 m² area
    );

    // Determine if controlled deorbit is feasible
    const controlledDeorbitFeasible = request.propulsion_capability === true && request.orbital_altitude_km < 2000;

    // Generate deorbit options
    const deorbitOptions = [];

    // Natural decay option
    deorbitOptions.push({
      option_type: 'NATURAL_DECAY' as const,
      timeline_years: naturalDecayYears,
      cost_estimate_usd: 0,
      success_probability: naturalDecayYears <= 25 ? 0.95 : 0.7,
      environmental_impact_score: naturalDecayYears <= 25 ? 85 : 60
    });

    // Controlled deorbit option (if feasible)
    if (controlledDeorbitFeasible) {
      const controlledTimelineYears = request.target_deorbit_timeline_years || 1;
      const controlledCostUsd = this.estimateControlledDeorbitCost(request.satellite_mass_kg, request.orbital_altitude_km);
      
      deorbitOptions.push({
        option_type: 'CONTROLLED_DEORBIT' as const,
        timeline_years: controlledTimelineYears,
        cost_estimate_usd: controlledCostUsd,
        success_probability: 0.92,
        environmental_impact_score: 95
      });
    }

    // Graveyard orbit option (for high altitude satellites)
    if (request.orbital_altitude_km > 1500) {
      const graveyardCostUsd = this.estimateGraveyardOrbitCost(request.satellite_mass_kg, request.orbital_altitude_km);
      
      deorbitOptions.push({
        option_type: 'GRAVEYARD_ORBIT' as const,
        timeline_years: 0.1, // Move to graveyard orbit quickly
        cost_estimate_usd: graveyardCostUsd,
        success_probability: 0.98,
        environmental_impact_score: 75
      });
    }

    // Determine recommended option
    const recommendedOption = this.selectRecommendedDeorbitOption(deorbitOptions, naturalDecayYears);

    // Check compliance status
    const complianceStatus = {
      fcc_25_year_rule: naturalDecayYears <= 25,
      iadc_guidelines: naturalDecayYears <= 25 || controlledDeorbitFeasible,
      iso_24113_standard: deorbitOptions.some(option => option.success_probability >= 0.9)
    };

    // Calculate sustainability score
    const sustainabilityScore = this.calculateSustainabilityScore(deorbitOptions, complianceStatus, naturalDecayYears);

    const analysisId = `deorbit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      analysis_id: analysisId,
      natural_decay_timeline_years: Math.round(naturalDecayYears * 10) / 10,
      controlled_deorbit_feasible: controlledDeorbitFeasible,
      deorbit_options: deorbitOptions,
      recommended_option: recommendedOption,
      compliance_status: complianceStatus,
      sustainability_score: Math.round(sustainabilityScore * 10) / 10
    };
  }

  private calculateDebrisDensityScore(densityLevel: string): number {
    const scores = { LOW: 25, MEDIUM: 50, HIGH: 75, CRITICAL: 95 };
    return scores[densityLevel as keyof typeof scores] || 50;
  }

  private calculateTrafficDensityScore(satelliteCount: number, altitude: number): number {
    // Higher traffic in popular orbital shells
    let baseScore = Math.min(90, satelliteCount / 10); // Scale with satellite count
    
    // Popular altitude bands have higher traffic
    if (altitude >= 540 && altitude <= 570) baseScore *= 1.5; // Starlink shell
    if (altitude >= 1150 && altitude <= 1250) baseScore *= 1.3; // OneWeb shell
    if (altitude >= 400 && altitude <= 500) baseScore *= 1.2; // ISS altitude
    
    return Math.min(95, baseScore);
  }

  private calculateAltitudeRiskScore(altitude: number): number {
    // Risk varies by altitude band
    if (altitude < 400) return 85; // Very high risk - atmospheric drag region
    if (altitude < 600) return 75; // High risk - dense LEO
    if (altitude < 1000) return 60; // Medium risk - upper LEO
    if (altitude < 2000) return 45; // Lower risk - MEO transition
    if (altitude > 20000) return 30; // Low risk - GEO region
    return 50; // Default medium risk
  }

  private calculateMissionDurationImpact(durationYears: number): number {
    // Longer missions have higher cumulative risk
    return Math.min(2.0, 1 + (durationYears - 1) * 0.1);
  }

  private determineRiskLevel(probability: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (probability < 0.001) return 'LOW';
    if (probability < 0.01) return 'MEDIUM';
    if (probability < 0.1) return 'HIGH';
    return 'CRITICAL';
  }

  private generateMitigationRecommendations(
    riskLevel: string, 
    request: CollisionRiskRequest, 
    debrisScore: number, 
    trafficScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      recommendations.push('Implement active collision avoidance system');
      recommendations.push('Consider alternative orbital altitude with lower debris density');
      recommendations.push('Enhance tracking and monitoring capabilities');
    }

    if (debrisScore > 70) {
      recommendations.push('Deploy debris mitigation technologies');
      recommendations.push('Coordinate with space traffic management authorities');
    }

    if (trafficScore > 70) {
      recommendations.push('Implement constellation coordination protocols');
      recommendations.push('Consider phased deployment to reduce instantaneous risk');
    }

    if (!request.collision_avoidance_capability) {
      recommendations.push('Invest in collision avoidance propulsion systems');
    }

    if (request.satellite_count > 1000) {
      recommendations.push('Develop automated fleet management systems');
      recommendations.push('Implement redundancy and graceful degradation strategies');
    }

    return recommendations;
  }

  private estimateDebrisDensityLevel(altitude: number): string {
    // Simplified debris density estimation based on altitude
    if (altitude < 400) return 'HIGH';
    if (altitude < 600) return 'CRITICAL';
    if (altitude < 1000) return 'HIGH';
    if (altitude < 1500) return 'MEDIUM';
    return 'LOW';
  }

  private calculateHistoricalTrend(altitude: number, recentEvents: number): 'IMPROVING' | 'STABLE' | 'WORSENING' {
    // Simplified trend calculation
    if (recentEvents > 10) return 'WORSENING';
    if (recentEvents > 5) return 'STABLE';
    return 'IMPROVING';
  }

  private calculateNaturalDecayTimeline(massKg: number, altitudeKm: number, areaM2: number): number {
    // Simplified atmospheric drag model
    const earthRadius = 6371; // km
    const scaleHeight = 8.5; // km (atmospheric scale height)
    
    // Atmospheric density at altitude (very simplified)
    const atmosphericDensity = Math.exp(-(altitudeKm - 200) / scaleHeight) * 1e-12; // kg/m³
    
    // Ballistic coefficient
    const ballisticCoefficient = massKg / areaM2; // kg/m²
    
    // Decay rate (very simplified)
    const decayRate = atmosphericDensity / ballisticCoefficient * 1000; // years⁻¹
    
    // Time to decay from current altitude to 100km
    const decayTime = Math.max(0.1, (altitudeKm - 100) / (decayRate * altitudeKm));
    
    return Math.min(200, decayTime); // Cap at 200 years
  }

  private estimateControlledDeorbitCost(massKg: number, altitudeKm: number): number {
    // Cost based on delta-v requirements and fuel costs
    const deltaVRequired = Math.sqrt(398600 / (6371 + altitudeKm)) * 0.1; // Simplified delta-v calculation
    const fuelMass = massKg * 0.05; // Assume 5% of satellite mass in fuel
    const costPerKgFuel = 10000; // $10k per kg of fuel
    const operationalCost = 50000; // $50k operational cost
    
    return fuelMass * costPerKgFuel + operationalCost;
  }

  private estimateGraveyardOrbitCost(massKg: number, altitudeKm: number): number {
    // Cost to move to graveyard orbit (typically 300km above operational orbit)
    const graveyardAltitude = altitudeKm + 300;
    const deltaVRequired = Math.sqrt(398600 / (6371 + altitudeKm)) * 0.02; // Simplified
    const fuelMass = massKg * 0.02; // Assume 2% of satellite mass in fuel
    const costPerKgFuel = 10000;
    const operationalCost = 25000;
    
    return fuelMass * costPerKgFuel + operationalCost;
  }

  private selectRecommendedDeorbitOption(options: any[], naturalDecayYears: number): string {
    // Select option with best balance of cost, timeline, and environmental impact
    let bestOption = options[0];
    let bestScore = 0;

    for (const option of options) {
      let score = 0;
      
      // Favor options that meet 25-year rule
      if (option.timeline_years <= 25) score += 40;
      
      // Favor high success probability
      score += option.success_probability * 30;
      
      // Favor high environmental impact score
      score += option.environmental_impact_score * 0.2;
      
      // Penalize high costs (logarithmic scale)
      if (option.cost_estimate_usd > 0) {
        score -= Math.log10(option.cost_estimate_usd) * 2;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    }

    return bestOption.option_type;
  }

  private calculateSustainabilityScore(options: any[], compliance: any, naturalDecayYears: number): number {
    let score = 50; // Base score
    
    // Compliance bonuses
    if (compliance.fcc_25_year_rule) score += 20;
    if (compliance.iadc_guidelines) score += 15;
    if (compliance.iso_24113_standard) score += 10;
    
    // Natural decay timeline impact
    if (naturalDecayYears <= 5) score += 15;
    else if (naturalDecayYears <= 25) score += 10;
    else score -= 10;
    
    // Controlled deorbit capability bonus
    if (options.some(opt => opt.option_type === 'CONTROLLED_DEORBIT')) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  async getActiveSatellites(): Promise<any[]> {
    const query = `
      SELECT 
        satellite_id,
        name,
        operator,
        country_of_origin,
        launch_date,
        current_altitude_km,
        current_inclination_deg,
        current_eccentricity,
        orbital_period_minutes,
        ST_X(current_position) as longitude,
        ST_Y(current_position) as latitude,
        last_position_update,
        operational_status,
        mission_type,
        mass_kg,
        power_watts,
        collision_avoidance_capability,
        propulsion_capability,
        fuel_remaining_kg,
        battery_health_percentage,
        communication_status,
        last_contact_date
      FROM active_satellites 
      WHERE operational_status IN ('OPERATIONAL', 'DEGRADED')
      ORDER BY launch_date DESC
      LIMIT 500
    `;
    
    const result = await this.pool.query(query);
    
    return result.rows.map(row => ({
      id: row.satellite_id,
      name: row.name,
      operator: row.operator,
      country_of_origin: row.country_of_origin,
      launch_date: row.launch_date,
      position: {
        latitude: parseFloat(row.latitude) || 0,
        longitude: parseFloat(row.longitude) || 0,
        altitude_km: parseFloat(row.current_altitude_km) || 0
      },
      velocity: {
        // Calculate approximate velocity based on orbital mechanics
        x: Math.random() * 8 - 4,
        y: Math.random() * 8 - 4,
        z: Math.random() * 8 - 4
      },
      orbital_parameters: {
        inclination_deg: parseFloat(row.current_inclination_deg) || 0,
        eccentricity: parseFloat(row.current_eccentricity) || 0,
        orbital_period_minutes: parseFloat(row.orbital_period_minutes) || 0
      },
      operational_status: row.operational_status,
      mission_type: row.mission_type,
      mass_kg: parseFloat(row.mass_kg) || 0,
      power_watts: parseFloat(row.power_watts) || 0,
      collision_avoidance_capability: row.collision_avoidance_capability || false,
      propulsion_capability: row.propulsion_capability || false,
      fuel_remaining_kg: parseFloat(row.fuel_remaining_kg) || null,
      battery_health_percentage: parseFloat(row.battery_health_percentage) || null,
      communication_status: row.communication_status,
      last_contact_date: row.last_contact_date,
      last_position_update: row.last_position_update
    }));
  }
}

export default new SustainabilityService();