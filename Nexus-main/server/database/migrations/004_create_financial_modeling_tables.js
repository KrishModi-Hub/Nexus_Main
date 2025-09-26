/**
 * Create financial modeling tables for cost components and insurance models
 */

exports.up = (pgm) => {
  // Create cost_components table
  pgm.createTable('cost_components', {
    id: 'id',
    component_name: { type: 'varchar(255)', notNull: true },
    component_category: {
      type: 'varchar(50)',
      notNull: true,
      check: "component_category IN ('DEVELOPMENT', 'MANUFACTURING', 'LAUNCH', 'OPERATIONS', 'INSURANCE', 'DEORBIT', 'REGULATORY')"
    },
    base_cost_usd: { type: 'decimal(15,2)', notNull: true },
    cost_per_unit: { type: 'decimal(15,2)' },
    cost_scaling_factor: { type: 'decimal(5,4)', default: 1.0 },
    cost_uncertainty_percentage: { 
      type: 'decimal(5,2)',
      check: 'cost_uncertainty_percentage BETWEEN 0 AND 100'
    },
    cost_drivers: { type: 'text[]' },
    applicable_mission_types: { type: 'text[]' },
    cost_model_version: { type: 'varchar(20)', default: '1.0' },
    inflation_adjustment_year: { type: 'integer' },
    currency: { type: 'varchar(3)', default: 'USD' },
    cost_breakdown: { type: 'jsonb' },
    historical_data_points: { type: 'integer', default: 0 },
    confidence_level: {
      type: 'decimal(3,2)',
      check: 'confidence_level BETWEEN 0 AND 1'
    },
    last_updated_date: { type: 'date' },
    data_source: { type: 'varchar(255)' },
    notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create insurance_models table
  pgm.createTable('insurance_models', {
    id: 'id',
    model_name: { type: 'varchar(255)', notNull: true },
    coverage_type: {
      type: 'varchar(50)',
      notNull: true,
      check: "coverage_type IN ('PRE_LAUNCH', 'LAUNCH', 'IN_ORBIT_LIFE', 'THIRD_PARTY_LIABILITY', 'COMPREHENSIVE')"
    },
    base_premium_rate: {
      type: 'decimal(6,4)',
      notNull: true,
      check: 'base_premium_rate BETWEEN 0 AND 1'
    },
    coverage_amount_usd: { type: 'decimal(15,2)', notNull: true },
    deductible_usd: { type: 'decimal(15,2)', default: 0 },
    policy_duration_months: { type: 'integer', notNull: true },
    risk_factors: { type: 'jsonb' },
    premium_adjustments: { type: 'jsonb' },
    exclusions: { type: 'text[]' },
    minimum_satellite_value_usd: { type: 'decimal(15,2)' },
    maximum_satellite_value_usd: { type: 'decimal(15,2)' },
    launch_vehicle_restrictions: { type: 'text[]' },
    orbital_altitude_restrictions: { type: new pgm.Type('int4range') },
    mission_type_restrictions: { type: 'text[]' },
    claims_history_impact: { type: 'decimal(4,3)', default: 1.0 },
    market_conditions_factor: { type: 'decimal(4,3)', default: 1.0 },
    regulatory_compliance_required: { type: 'boolean', default: true },
    insurer_rating: { type: 'varchar(10)' },
    policy_terms_url: { type: 'varchar(500)' },
    contact_information: { type: 'jsonb' },
    active_status: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add indexes for performance
  pgm.createIndex('cost_components', 'component_category');
  pgm.createIndex('cost_components', 'component_name');
  pgm.createIndex('cost_components', 'applicable_mission_types', { method: 'gin' });
  
  pgm.createIndex('insurance_models', 'coverage_type');
  pgm.createIndex('insurance_models', 'active_status');
  pgm.createIndex('insurance_models', 'base_premium_rate');
  pgm.createIndex('insurance_models', 'coverage_amount_usd');
};

exports.down = (pgm) => {
  pgm.dropTable('insurance_models');
  pgm.dropTable('cost_components');
};