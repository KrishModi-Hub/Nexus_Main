/**
 * Create collision events table for tracking space debris and collision incidents
 */

exports.up = (pgm) => {
  // Create collision_events table
  pgm.createTable('collision_events', {
    id: 'id',
    event_date: { type: 'timestamp', notNull: true },
    primary_object_id: { type: 'varchar(50)', notNull: true },
    secondary_object_id: { type: 'varchar(50)' },
    primary_object_type: { 
      type: 'varchar(20)', 
      notNull: true,
      check: "primary_object_type IN ('SATELLITE', 'DEBRIS', 'ROCKET_BODY', 'UNKNOWN')"
    },
    secondary_object_type: { 
      type: 'varchar(20)',
      check: "secondary_object_type IN ('SATELLITE', 'DEBRIS', 'ROCKET_BODY', 'UNKNOWN')"
    },
    collision_probability: { 
      type: 'decimal(10,8)', 
      notNull: true,
      check: 'collision_probability BETWEEN 0 AND 1'
    },
    miss_distance_km: { type: 'decimal(10,4)' },
    relative_velocity_km_s: { type: 'decimal(8,4)' },
    altitude_km: { type: 'decimal(8,2)', notNull: true },
    latitude_deg: { type: 'decimal(8,5)' },
    longitude_deg: { type: 'decimal(9,5)' },
    location: { type: 'geometry(POINT, 4326)' },
    event_severity: {
      type: 'varchar(20)',
      notNull: true,
      check: "event_severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')"
    },
    debris_generated: { type: 'integer', default: 0 },
    economic_impact_usd: { type: 'decimal(15,2)' },
    mission_impact: { type: 'text' },
    avoidance_maneuver_performed: { type: 'boolean', default: false },
    maneuver_delta_v_m_s: { type: 'decimal(8,4)' },
    maneuver_fuel_cost_kg: { type: 'decimal(8,4)' },
    data_source: { type: 'varchar(100)' },
    confidence_level: { 
      type: 'decimal(3,2)',
      check: 'confidence_level BETWEEN 0 AND 1'
    },
    follow_up_required: { type: 'boolean', default: false },
    resolution_status: {
      type: 'varchar(20)',
      default: 'OPEN',
      check: "resolution_status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED')"
    },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add indexes for performance
  pgm.createIndex('collision_events', 'event_date');
  pgm.createIndex('collision_events', 'primary_object_id');
  pgm.createIndex('collision_events', 'event_severity');
  pgm.createIndex('collision_events', 'collision_probability');
  pgm.createIndex('collision_events', 'altitude_km');
  pgm.createIndex('collision_events', 'resolution_status');
  
  // Spatial index for location
  pgm.createIndex('collision_events', 'location', { method: 'gist' });
};

exports.down = (pgm) => {
  pgm.dropTable('collision_events');
};