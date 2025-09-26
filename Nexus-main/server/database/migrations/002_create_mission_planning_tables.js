/**
 * Create mission planning tables for satellite configurations, launch vehicles, and orbital shells
 */

exports.up = (pgm) => {
  // Create satellite_configurations table
  pgm.createTable('satellite_configurations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    mass_kg: { type: 'decimal(10,2)', notNull: true },
    power_watts: { type: 'decimal(10,2)', notNull: true },
    payload_capacity_kg: { type: 'decimal(10,2)', notNull: true },
    operational_lifetime_years: { type: 'decimal(5,2)', notNull: true },
    propulsion_type: { type: 'varchar(100)' },
    communication_bands: { type: 'text[]' },
    mission_type: { type: 'varchar(100)', notNull: true },
    manufacturer: { type: 'varchar(255)' },
    cost_usd: { type: 'decimal(15,2)' },
    launch_readiness_level: { type: 'integer', check: 'launch_readiness_level BETWEEN 1 AND 9' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create launch_vehicles table
  pgm.createTable('launch_vehicles', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    manufacturer: { type: 'varchar(255)', notNull: true },
    payload_capacity_leo_kg: { type: 'decimal(10,2)', notNull: true },
    payload_capacity_gto_kg: { type: 'decimal(10,2)' },
    launch_cost_usd: { type: 'decimal(15,2)', notNull: true },
    reliability_percentage: { type: 'decimal(5,2)', check: 'reliability_percentage BETWEEN 0 AND 100' },
    first_flight_date: { type: 'date' },
    total_flights: { type: 'integer', default: 0 },
    successful_flights: { type: 'integer', default: 0 },
    fairing_diameter_m: { type: 'decimal(5,2)' },
    fairing_height_m: { type: 'decimal(5,2)' },
    reusable: { type: 'boolean', default: false },
    active_status: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Create orbital_shells table
  pgm.createTable('orbital_shells', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    altitude_range_km: { type: new pgm.Type('int4range'), notNull: true },
    inclination_deg: { type: 'decimal(5,2)', notNull: true },
    orbital_period_minutes: { type: 'decimal(8,2)' },
    max_satellites: { type: 'integer' },
    current_satellites: { type: 'integer', default: 0 },
    debris_density_level: { type: 'varchar(20)', check: "debris_density_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')" },
    regulatory_framework: { type: 'varchar(100)' },
    collision_risk_score: { type: 'decimal(3,2)', check: 'collision_risk_score BETWEEN 0 AND 1' },
    sustainability_rating: { type: 'varchar(10)', check: "sustainability_rating IN ('A', 'B', 'C', 'D', 'F')" },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add indexes for performance
  pgm.createIndex('satellite_configurations', 'mission_type');
  pgm.createIndex('satellite_configurations', 'manufacturer');
  pgm.createIndex('launch_vehicles', 'manufacturer');
  pgm.createIndex('launch_vehicles', 'active_status');
  pgm.createIndex('orbital_shells', 'altitude_range_km');
  pgm.createIndex('orbital_shells', 'debris_density_level');
};

exports.down = (pgm) => {
  pgm.dropTable('orbital_shells');
  pgm.dropTable('launch_vehicles');
  pgm.dropTable('satellite_configurations');
};