/**
 * Create additional tracking and analysis tables for comprehensive space situational awareness
 */

exports.up = (pgm) => {
  // Create orbital_debris table
  pgm.createTable('orbital_debris', {
    id: 'id',
    debris_id: { type: 'varchar(50)', notNull: true, unique: true },
    object_name: { type: 'varchar(255)' },
    object_type: {
      type: 'varchar(30)',
      notNull: true,
      check: "object_type IN ('ROCKET_BODY', 'PAYLOAD_DEBRIS', 'MISSION_RELATED_DEBRIS', 'FRAGMENTATION_DEBRIS', 'UNKNOWN')"
    },
    source_satellite_id: { type: 'varchar(50)' },
    creation_date: { type: 'date' },
    creation_event: { type: 'varchar(100)' },
    current_altitude_km: { type: 'decimal(8,2)', notNull: true },
    current_inclination_deg: { type: 'decimal(8,5)' },
    current_eccentricity: { type: 'decimal(10,8)' },
    orbital_period_minutes: { type: 'decimal(8,2)' },
    estimated_size_cm: { type: 'decimal(8,2)' },
    estimated_mass_kg: { type: 'decimal(10,4)' },
    radar_cross_section_m2: { type: 'decimal(10,6)' },
    tracking_confidence: {
      type: 'varchar(20)',
      check: "tracking_confidence IN ('HIGH', 'MEDIUM', 'LOW', 'ESTIMATED')"
    },
    collision_risk_level: {
      type: 'varchar(20)',
      check: "collision_risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NEGLIGIBLE')"
    },
    decay_prediction_date: { type: 'date' },
    decay_confidence_days: { type: 'integer' },
    last_observation_date: { type: 'timestamp' },
    observation_frequency_days: { type: 'decimal(5,2)' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create conjunction_assessments table
  pgm.createTable('conjunction_assessments', {
    id: 'id',
    assessment_id: { type: 'varchar(100)', notNull: true, unique: true },
    primary_object_id: { type: 'varchar(50)', notNull: true },
    secondary_object_id: { type: 'varchar(50)', notNull: true },
    time_of_closest_approach: { type: 'timestamp', notNull: true },
    miss_distance_km: { type: 'decimal(10,4)', notNull: true },
    collision_probability: {
      type: 'decimal(12,10)',
      check: 'collision_probability BETWEEN 0 AND 1'
    },
    relative_velocity_km_s: { type: 'decimal(8,4)' },
    approach_geometry: { type: 'varchar(50)' },
    uncertainty_ellipse_major_km: { type: 'decimal(8,4)' },
    uncertainty_ellipse_minor_km: { type: 'decimal(8,4)' },
    assessment_accuracy: {
      type: 'varchar(20)',
      check: "assessment_accuracy IN ('HIGH', 'MEDIUM', 'LOW', 'PRELIMINARY')"
    },
    risk_threshold_exceeded: { type: 'boolean', default: false },
    recommended_action: {
      type: 'varchar(30)',
      check: "recommended_action IN ('MONITOR', 'ALERT_OPERATOR', 'RECOMMEND_MANEUVER', 'EMERGENCY_MANEUVER', 'NO_ACTION')"
    },
    operator_notified: { type: 'boolean', default: false },
    notification_timestamp: { type: 'timestamp' },
    maneuver_planned: { type: 'boolean', default: false },
    maneuver_executed: { type: 'boolean', default: false },
    maneuver_details: { type: 'jsonb' },
    assessment_source: { type: 'varchar(100)' },
    follow_up_required: { type: 'boolean', default: false },
    resolution_status: {
      type: 'varchar(20)',
      default: 'ACTIVE',
      check: "resolution_status IN ('ACTIVE', 'RESOLVED', 'FALSE_ALARM', 'ARCHIVED')"
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create mission_profiles table
  pgm.createTable('mission_profiles', {
    id: 'id',
    mission_name: { type: 'varchar(255)', notNull: true },
    mission_operator: { type: 'varchar(255)', notNull: true },
    mission_type: { type: 'varchar(100)', notNull: true },
    constellation_name: { type: 'varchar(255)' },
    planned_satellites: { type: 'integer', notNull: true },
    deployed_satellites: { type: 'integer', default: 0 },
    operational_satellites: { type: 'integer', default: 0 },
    target_orbital_shell_id: { type: 'integer' },
    launch_campaign_start: { type: 'date' },
    launch_campaign_end: { type: 'date' },
    mission_duration_years: { type: 'decimal(5,2)' },
    total_mission_cost_usd: { type: 'decimal(18,2)' },
    funding_sources: { type: 'text[]' },
    regulatory_approvals: { type: 'jsonb' },
    environmental_impact_assessment: { type: 'text' },
    sustainability_commitments: { type: 'text[]' },
    deorbit_strategy: { type: 'text' },
    collision_avoidance_protocol: { type: 'text' },
    data_sharing_agreements: { type: 'text[]' },
    international_coordination: { type: 'boolean', default: false },
    mission_status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'PLANNING',
      check: "mission_status IN ('PLANNING', 'APPROVED', 'ACTIVE_DEPLOYMENT', 'OPERATIONAL', 'DECOMMISSIONING', 'COMPLETED', 'CANCELLED')"
    },
    risk_assessment_score: {
      type: 'decimal(4,2)',
      check: 'risk_assessment_score BETWEEN 0 AND 100'
    },
    public_information_url: { type: 'varchar(500)' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add foreign key constraints
  pgm.addConstraint('orbital_debris', 'fk_source_satellite', {
    foreignKeys: {
      columns: 'source_satellite_id',
      references: 'active_satellites(satellite_id)',
      onDelete: 'SET NULL'
    }
  });

  pgm.addConstraint('mission_profiles', 'fk_target_orbital_shell', {
    foreignKeys: {
      columns: 'target_orbital_shell_id',
      references: 'orbital_shells(id)',
      onDelete: 'SET NULL'
    }
  });

  // Add indexes for performance
  pgm.createIndex('orbital_debris', 'debris_id');
  pgm.createIndex('orbital_debris', 'object_type');
  pgm.createIndex('orbital_debris', 'current_altitude_km');
  pgm.createIndex('orbital_debris', 'collision_risk_level');
  pgm.createIndex('orbital_debris', 'decay_prediction_date');
  
  pgm.createIndex('conjunction_assessments', 'assessment_id');
  pgm.createIndex('conjunction_assessments', 'time_of_closest_approach');
  pgm.createIndex('conjunction_assessments', 'collision_probability');
  pgm.createIndex('conjunction_assessments', 'risk_threshold_exceeded');
  pgm.createIndex('conjunction_assessments', 'resolution_status');
  
  pgm.createIndex('mission_profiles', 'mission_operator');
  pgm.createIndex('mission_profiles', 'mission_type');
  pgm.createIndex('mission_profiles', 'mission_status');
  pgm.createIndex('mission_profiles', 'constellation_name');
};

exports.down = (pgm) => {
  pgm.dropTable('mission_profiles');
  pgm.dropTable('conjunction_assessments');
  pgm.dropTable('orbital_debris');
};