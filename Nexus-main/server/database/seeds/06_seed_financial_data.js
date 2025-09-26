const faker = require('faker');

const costCategories = [
  'DEVELOPMENT',
  'MANUFACTURING', 
  'LAUNCH',
  'OPERATIONS',
  'INSURANCE',
  'DEORBIT',
  'REGULATORY'
];

const coverageTypes = [
  'PRE_LAUNCH',
  'LAUNCH',
  'IN_ORBIT_LIFE',
  'THIRD_PARTY_LIABILITY',
  'COMPREHENSIVE'
];

const costComponents = [
  {
    component_name: 'Satellite Bus Development',
    component_category: 'DEVELOPMENT',
    base_cost_usd: 25000000,
    cost_per_unit: 5000000,
    cost_scaling_factor: 0.85,
    cost_uncertainty_percentage: 15.0,
    cost_drivers: ['Technology Readiness Level', 'Heritage Design', 'Testing Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation'],
    confidence_level: 0.85
  },
  {
    component_name: 'Payload Development',
    component_category: 'DEVELOPMENT',
    base_cost_usd: 15000000,
    cost_per_unit: 3000000,
    cost_scaling_factor: 0.90,
    cost_uncertainty_percentage: 20.0,
    cost_drivers: ['Payload Complexity', 'Custom Components', 'Performance Requirements'],
    applicable_mission_types: ['Earth Observation', 'Scientific Research', 'Communications'],
    confidence_level: 0.80
  },
  {
    component_name: 'Ground Segment Development',
    component_category: 'DEVELOPMENT',
    base_cost_usd: 8000000,
    cost_per_unit: 1000000,
    cost_scaling_factor: 0.95,
    cost_uncertainty_percentage: 12.0,
    cost_drivers: ['Number of Ground Stations', 'Data Processing Complexity', 'Automation Level'],
    applicable_mission_types: ['Earth Observation', 'Communications', 'Navigation'],
    confidence_level: 0.90
  },
  {
    component_name: 'Satellite Manufacturing',
    component_category: 'MANUFACTURING',
    base_cost_usd: 2000000,
    cost_per_unit: 1500000,
    cost_scaling_factor: 0.88,
    cost_uncertainty_percentage: 10.0,
    cost_drivers: ['Production Volume', 'Manufacturing Complexity', 'Quality Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Internet Constellation'],
    confidence_level: 0.92
  },
  {
    component_name: 'Integration and Testing',
    component_category: 'MANUFACTURING',
    base_cost_usd: 500000,
    cost_per_unit: 300000,
    cost_scaling_factor: 0.95,
    cost_uncertainty_percentage: 8.0,
    cost_drivers: ['Test Campaign Duration', 'Environmental Testing', 'Qualification Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation', 'Scientific Research'],
    confidence_level: 0.95
  },
  {
    component_name: 'Launch Services',
    component_category: 'LAUNCH',
    base_cost_usd: 60000000,
    cost_per_unit: 15000000,
    cost_scaling_factor: 0.92,
    cost_uncertainty_percentage: 18.0,
    cost_drivers: ['Launch Vehicle Selection', 'Orbit Requirements', 'Rideshare Opportunities'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation', 'Internet Constellation'],
    confidence_level: 0.88
  },
  {
    component_name: 'Mission Operations',
    component_category: 'OPERATIONS',
    base_cost_usd: 1000000,
    cost_per_unit: 500000,
    cost_scaling_factor: 1.02,
    cost_uncertainty_percentage: 15.0,
    cost_drivers: ['Mission Duration', 'Operations Complexity', 'Staffing Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation', 'Scientific Research'],
    confidence_level: 0.85
  },
  {
    component_name: 'Ground Operations',
    component_category: 'OPERATIONS',
    base_cost_usd: 800000,
    cost_per_unit: 200000,
    cost_scaling_factor: 1.01,
    cost_uncertainty_percentage: 12.0,
    cost_drivers: ['Ground Station Network', 'Data Processing Volume', 'Maintenance Requirements'],
    applicable_mission_types: ['Earth Observation', 'Communications', 'Weather Monitoring'],
    confidence_level: 0.90
  },
  {
    component_name: 'Launch Insurance',
    component_category: 'INSURANCE',
    base_cost_usd: 5000000,
    cost_per_unit: 3000000,
    cost_scaling_factor: 1.05,
    cost_uncertainty_percentage: 25.0,
    cost_drivers: ['Launch Vehicle Reliability', 'Payload Value', 'Market Conditions'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation'],
    confidence_level: 0.75
  },
  {
    component_name: 'In-Orbit Insurance',
    component_category: 'INSURANCE',
    base_cost_usd: 8000000,
    cost_per_unit: 4000000,
    cost_scaling_factor: 1.03,
    cost_uncertainty_percentage: 20.0,
    cost_drivers: ['Mission Duration', 'Orbital Environment', 'Satellite Reliability'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation'],
    confidence_level: 0.80
  },
  {
    component_name: 'End-of-Life Disposal',
    component_category: 'DEORBIT',
    base_cost_usd: 200000,
    cost_per_unit: 100000,
    cost_scaling_factor: 1.00,
    cost_uncertainty_percentage: 30.0,
    cost_drivers: ['Deorbit Method', 'Orbital Altitude', 'Regulatory Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation', 'Internet Constellation'],
    confidence_level: 0.70
  },
  {
    component_name: 'Regulatory Compliance',
    component_category: 'REGULATORY',
    base_cost_usd: 500000,
    cost_per_unit: 100000,
    cost_scaling_factor: 1.00,
    cost_uncertainty_percentage: 35.0,
    cost_drivers: ['Regulatory Complexity', 'International Coordination', 'Licensing Requirements'],
    applicable_mission_types: ['Communications', 'Earth Observation', 'Navigation', 'Internet Constellation'],
    confidence_level: 0.65
  }
];

const insuranceModels = [
  {
    model_name: 'Standard Launch Coverage',
    coverage_type: 'LAUNCH',
    base_premium_rate: 0.08,
    coverage_amount_usd: 150000000,
    deductible_usd: 5000000,
    policy_duration_months: 6,
    risk_factors: {
      launch_vehicle_reliability: 0.98,
      weather_conditions: 0.95,
      range_safety: 0.99
    },
    premium_adjustments: {
      new_launch_vehicle: 1.5,
      proven_launch_vehicle: 0.9,
      multiple_satellites: 0.85
    },
    exclusions: ['War', 'Nuclear Risks', 'Cyber Attacks'],
    minimum_satellite_value_usd: 10000000,
    maximum_satellite_value_usd: 500000000,
    active_status: true
  },
  {
    model_name: 'Premium In-Orbit Life',
    coverage_type: 'IN_ORBIT_LIFE',
    base_premium_rate: 0.12,
    coverage_amount_usd: 200000000,
    deductible_usd: 10000000,
    policy_duration_months: 180,
    risk_factors: {
      orbital_debris: 0.85,
      solar_activity: 0.90,
      component_reliability: 0.95
    },
    premium_adjustments: {
      leo_orbit: 1.2,
      geo_orbit: 1.0,
      collision_avoidance: 0.9
    },
    exclusions: ['Wear and Tear', 'Design Defects', 'Operator Error'],
    minimum_satellite_value_usd: 25000000,
    maximum_satellite_value_usd: 1000000000,
    active_status: true
  },
  {
    model_name: 'Third Party Liability',
    coverage_type: 'THIRD_PARTY_LIABILITY',
    base_premium_rate: 0.02,
    coverage_amount_usd: 100000000,
    deductible_usd: 1000000,
    policy_duration_months: 120,
    risk_factors: {
      collision_probability: 0.80,
      debris_generation: 0.75,
      populated_areas: 0.85
    },
    premium_adjustments: {
      high_traffic_orbit: 1.3,
      deorbit_capability: 0.8,
      tracking_accuracy: 0.9
    },
    exclusions: ['Intentional Acts', 'War', 'Regulatory Violations'],
    minimum_satellite_value_usd: 1000000,
    maximum_satellite_value_usd: 2000000000,
    active_status: true
  },
  {
    model_name: 'Constellation Coverage',
    coverage_type: 'COMPREHENSIVE',
    base_premium_rate: 0.15,
    coverage_amount_usd: 2000000000,
    deductible_usd: 50000000,
    policy_duration_months: 240,
    risk_factors: {
      constellation_size: 0.70,
      orbital_congestion: 0.75,
      operational_complexity: 0.80
    },
    premium_adjustments: {
      phased_deployment: 0.9,
      redundancy_built_in: 0.85,
      experienced_operator: 0.8
    },
    exclusions: ['Regulatory Changes', 'Technology Obsolescence', 'Market Risks'],
    minimum_satellite_value_usd: 100000000,
    maximum_satellite_value_usd: 10000000000,
    active_status: true
  },
  {
    model_name: 'Small Satellite Launch',
    coverage_type: 'LAUNCH',
    base_premium_rate: 0.06,
    coverage_amount_usd: 25000000,
    deductible_usd: 1000000,
    policy_duration_months: 3,
    risk_factors: {
      rideshare_mission: 0.90,
      small_launcher: 0.85,
      payload_integration: 0.95
    },
    premium_adjustments: {
      cubesat_deployer: 0.8,
      dedicated_launch: 1.2,
      secondary_payload: 0.7
    },
    exclusions: ['Primary Payload Interference', 'Deployment Failures'],
    minimum_satellite_value_usd: 500000,
    maximum_satellite_value_usd: 50000000,
    active_status: true
  }
];

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE cost_components RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE TABLE insurance_models RESTART IDENTITY CASCADE');
    
    // Insert cost components
    for (const component of costComponents) {
      const query = `
        INSERT INTO cost_components (
          component_name, component_category, base_cost_usd, cost_per_unit,
          cost_scaling_factor, cost_uncertainty_percentage, cost_drivers,
          applicable_mission_types, cost_model_version, inflation_adjustment_year,
          currency, confidence_level, last_updated_date, data_source, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;
      
      await client.query(query, [
        component.component_name,
        component.component_category,
        component.base_cost_usd,
        component.cost_per_unit,
        component.cost_scaling_factor,
        component.cost_uncertainty_percentage,
        component.cost_drivers,
        component.applicable_mission_types,
        '2.0',
        2024,
        'USD',
        component.confidence_level,
        '2024-01-01',
        'Industry Analysis',
        'Based on 2024 market data and historical trends'
      ]);
    }
    
    // Insert insurance models
    for (const model of insuranceModels) {
      const query = `
        INSERT INTO insurance_models (
          model_name, coverage_type, base_premium_rate, coverage_amount_usd,
          deductible_usd, policy_duration_months, risk_factors, premium_adjustments,
          exclusions, minimum_satellite_value_usd, maximum_satellite_value_usd,
          claims_history_impact, market_conditions_factor, regulatory_compliance_required,
          insurer_rating, active_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;
      
      await client.query(query, [
        model.model_name,
        model.coverage_type,
        model.base_premium_rate,
        model.coverage_amount_usd,
        model.deductible_usd,
        model.policy_duration_months,
        JSON.stringify(model.risk_factors),
        JSON.stringify(model.premium_adjustments),
        model.exclusions,
        model.minimum_satellite_value_usd,
        model.maximum_satellite_value_usd,
        1.0,
        1.0,
        true,
        'A+',
        model.active_status
      ]);
    }
    
    console.log(`   ✓ Inserted ${costComponents.length} cost components`);
    console.log(`   ✓ Inserted ${insuranceModels.length} insurance models`);
    
  } catch (error) {
    console.error('Error seeding financial data:', error);
    throw error;
  }
}

module.exports = { seed };