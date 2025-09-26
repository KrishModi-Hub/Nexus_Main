/**
 * Create sustainability and tracking tables for sustainability scores and active satellites
 */

exports.up = (pgm) => {
  // Create sustainability_scores table
  pgm.createTable('sustainability_scores', {
    id: 'id',
    entity_type: {
      type: 'varchar(20)',
      notNull: true,
      check: "entity_type IN ('SATELLITE', 'CONSTELLATION', 'MISSION', 'OPERATOR', 'ORBITAL_SHELL')"
    },
    entity_id: { type: 'varchar(100)', notNull: true },
    entity_name: { type: 'varchar(255)', notNull: true },
    overall_score: {
      type: 'decimal(4,2)',
      notNull: true,
      check: 'overall_score BETWEEN 0 AND 100'
    },
    environmental_impact_score: {
      type: 'decimal(4,2)',
      check: 'environmental_impact_score BETWEEN 0 AND 100'
    },
    debris_mitigation_score: {
      type: 'decimal(4,2)',
      check: 'debris_mitigation_score BETWEEN 0 AND 100'
    },
    end_of_life_planning_score: {
      type: 'decimal(4,2)',
      check: 'end_of_life_planning_score BETWEEN 0 AND 100'
    },
    collision_avoidance_score: {
      type: 'decimal(4,2)',
      check: 'collision_avoidance_score BETWEEN 0 AND 100'
    },
    regulatory_compliance_score: {
      type: 'decimal(4,2)',
      check: 'regulatory_compliance_score BETWEEN 0 AND 100'
    },
    innovation_sustainability_score: {
      type: 'decimal(4,2)',
      check: 'innovation_sustainability_score BETWEEN 0 AND 100'
    },
    scoring_methodology_version: { type: 'varchar(20)', default: '1.0' },
    assessment_date: { type: 'date', notNull: true },
    assessor_organization: { type: 'varchar(255)' },
    certification_level: {
      type: 'varchar(20)',
      check: "certification_level IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NONE')"
    },
    improvement_recommendations: { type: 'text[]' },
    compliance_gaps: { type: 'text[]' },
    next_assessment_due: { type: 'date' },
    public_disclosure_approved: { type: 'boolean', default: false },
    score_trend: {
      type: 'varchar(20)',
      check: "score_trend IN ('IMPROVING', 'STABLE', 'DECLINING', 'NEW')"
    },
    benchmark_percentile: {
      type: 'decimal(5,2)',
      check: 'benchmark_percentile BETWEEN 0 AND 100'
    },
    supporting_documentation: { type: 'jsonb' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create active_satellites table
  pgm.createTable('active_satellites', {
    id: 'id',
    satellite_id: { type: 'varchar(50)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    operator: { type: 'varchar(255)', notNull: true },
    country_of_origin: { type: 'varchar(100)' },
    launch_date: { type: 'date', notNull: true },
    launch_vehicle: { type: 'varchar(255)' },
    launch_site: { type: 'varchar(255)' },
    current_altitude_km: { type: 'decimal(8,2)', notNull: true },
    current_inclination_deg: { type: 'decimal(8,5)' },
    current_eccentricity: { type: 'decimal(10,8)' },
    orbital_period_minutes: { type: 'decimal(8,2)' },
    current_position: { type: 'geometry(POINT, 4326)' },
    last_position_update: { type: 'timestamp' },
    operational_status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'OPERATIONAL',
      check: "operational_status IN ('OPERATIONAL', 'DEGRADED', 'NON_OPERATIONAL', 'DEORBITING', 'DEORBITED', 'UNKNOWN')"
    },
    mission_type: { type: 'varchar(100)', notNull: true },
    mass_kg: { type: 'decimal(10,2)' },
    power_watts: { type: 'decimal(10,2)' },
    expected_lifetime_years: { type: 'decimal(5,2)' },
    deorbit_plan_status: {
      type: 'varchar(20)',
      check: "deorbit_plan_status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NOT_REQUIRED')"
    },
    collision_avoidance_capability: { type: 'boolean', default: false },
    propulsion_capability: { type: 'boolean', default: false },
    tracking_accuracy_m: { type: 'decimal(8,2)' },
    last_maneuver_date: { type: 'date' },
    total_maneuvers_performed: { type: 'integer', default: 0 },
    fuel_remaining_kg: { type: 'decimal(8,4)' },
    battery_health_percentage: {
      type: 'decimal(5,2)',
      check: 'battery_health_percentage BETWEEN 0 AND 100'
    },
    communication_status: {
      type: 'varchar(20)',
      check: "communication_status IN ('ACTIVE', 'INTERMITTENT', 'LOST', 'SCHEDULED_SILENCE')"
    },
    last_contact_date: { type: 'timestamp' },
    regulatory_licenses: { type: 'text[]' },
    insurance_coverage_usd: { type: 'decimal(15,2)' },
    sustainability_score_id: { type: 'integer' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add foreign key constraint
  pgm.addConstraint('active_satellites', 'fk_sustainability_score', {
    foreignKeys: {
      columns: 'sustainability_score_id',
      references: 'sustainability_scores(id)',
      onDelete: 'SET NULL'
    }
  });

  // Add indexes for performance
  pgm.createIndex('sustainability_scores', 'entity_type');
  pgm.createIndex('sustainability_scores', 'entity_id');
  pgm.createIndex('sustainability_scores', 'overall_score');
  pgm.createIndex('sustainability_scores', 'assessment_date');
  pgm.createIndex('sustainability_scores', 'certification_level');
  
  pgm.createIndex('active_satellites', 'satellite_id');
  pgm.createIndex('active_satellites', 'operator');
  pgm.createIndex('active_satellites', 'operational_status');
  pgm.createIndex('active_satellites', 'mission_type');
  pgm.createIndex('active_satellites', 'launch_date');
  pgm.createIndex('active_satellites', 'current_altitude_km');
  pgm.createIndex('active_satellites', 'deorbit_plan_status');
  
  // Spatial index for current position
  pgm.createIndex('active_satellites', 'current_position', { method: 'gist' });
};

exports.down = (pgm) => {
  pgm.dropTable('active_satellites');
  pgm.dropTable('sustainability_scores');
};