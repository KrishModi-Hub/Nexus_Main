const faker = require('faker');

const eventSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const objectTypes = ['SATELLITE', 'DEBRIS', 'ROCKET_BODY', 'UNKNOWN'];
const resolutionStatuses = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];
const dataSources = [
  'USSTRATCOM',
  'ESA Space Debris Office',
  'JAXA JSPOC',
  'ISRO NETRA',
  'CNSA SSA',
  'Commercial SSA Provider',
  'Ground-based Radar',
  'Space-based Sensors'
];

function generateCollisionEvent() {
  const eventDate = faker.date.between('2020-01-01', '2024-12-31');
  const altitudeKm = faker.datatype.float({ min: 200, max: 2000, precision: 0.1 });
  const latitude = faker.datatype.float({ min: -90, max: 90, precision: 0.00001 });
  const longitude = faker.datatype.float({ min: -180, max: 180, precision: 0.00001 });
  const collisionProbability = faker.datatype.float({ min: 0.00000001, max: 0.1, precision: 0.00000001 });
  const missDistanceKm = faker.datatype.float({ min: 0.001, max: 50, precision: 0.001 });
  const relativeVelocityKmS = faker.datatype.float({ min: 0.5, max: 15, precision: 0.001 });
  const severity = faker.random.arrayElement(eventSeverities);
  
  // Generate realistic NORAD IDs (5-digit numbers)
  const primaryObjectId = faker.datatype.number({ min: 10000, max: 99999 }).toString();
  const secondaryObjectId = faker.datatype.number({ min: 10000, max: 99999 }).toString();
  
  const avoidanceManeuverPerformed = faker.datatype.boolean();
  const debrisGenerated = severity === 'CRITICAL' ? faker.datatype.number({ min: 10, max: 1000 }) : 
                         severity === 'HIGH' ? faker.datatype.number({ min: 1, max: 50 }) : 0;
  
  const economicImpactUsd = severity === 'CRITICAL' ? faker.datatype.number({ min: 10000000, max: 500000000 }) :
                           severity === 'HIGH' ? faker.datatype.number({ min: 1000000, max: 50000000 }) :
                           severity === 'MEDIUM' ? faker.datatype.number({ min: 100000, max: 5000000 }) :
                           faker.datatype.number({ min: 0, max: 500000 });
  
  return {
    event_date: eventDate,
    primary_object_id: primaryObjectId,
    secondary_object_id: secondaryObjectId,
    primary_object_type: faker.random.arrayElement(objectTypes),
    secondary_object_type: faker.random.arrayElement(objectTypes),
    collision_probability: collisionProbability,
    miss_distance_km: missDistanceKm,
    relative_velocity_km_s: relativeVelocityKmS,
    altitude_km: altitudeKm,
    latitude_deg: latitude,
    longitude_deg: longitude,
    event_severity: severity,
    debris_generated: debrisGenerated,
    economic_impact_usd: economicImpactUsd,
    mission_impact: faker.lorem.sentence(),
    avoidance_maneuver_performed: avoidanceManeuverPerformed,
    maneuver_delta_v_m_s: avoidanceManeuverPerformed ? faker.datatype.float({ min: 0.1, max: 10, precision: 0.01 }) : null,
    maneuver_fuel_cost_kg: avoidanceManeuverPerformed ? faker.datatype.float({ min: 0.01, max: 5, precision: 0.01 }) : null,
    data_source: faker.random.arrayElement(dataSources),
    confidence_level: faker.datatype.float({ min: 0.5, max: 1.0, precision: 0.01 }),
    follow_up_required: faker.datatype.boolean(),
    resolution_status: faker.random.arrayElement(resolutionStatuses)
  };
}

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE collision_events RESTART IDENTITY CASCADE');
    
    const events = [];
    
    // Generate 150 collision events
    for (let i = 0; i < 150; i++) {
      events.push(generateCollisionEvent());
    }
    
    // Insert events in batches
    const batchSize = 10;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      
      for (const event of batch) {
        const query = `
          INSERT INTO collision_events (
            event_date, primary_object_id, secondary_object_id, primary_object_type,
            secondary_object_type, collision_probability, miss_distance_km, relative_velocity_km_s,
            altitude_km, latitude_deg, longitude_deg, location, event_severity, debris_generated,
            economic_impact_usd, mission_impact, avoidance_maneuver_performed, maneuver_delta_v_m_s,
            maneuver_fuel_cost_kg, data_source, confidence_level, follow_up_required, resolution_status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
            ST_SetSRID(ST_MakePoint($12, $13), 4326),
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
          )
        `;
        
        await client.query(query, [
          event.event_date,
          event.primary_object_id,
          event.secondary_object_id,
          event.primary_object_type,
          event.secondary_object_type,
          event.collision_probability,
          event.miss_distance_km,
          event.relative_velocity_km_s,
          event.altitude_km,
          event.latitude_deg,
          event.longitude_deg,
          event.longitude_deg, // For ST_MakePoint (longitude first)
          event.latitude_deg,  // For ST_MakePoint (latitude second)
          event.event_severity,
          event.debris_generated,
          event.economic_impact_usd,
          event.mission_impact,
          event.avoidance_maneuver_performed,
          event.maneuver_delta_v_m_s,
          event.maneuver_fuel_cost_kg,
          event.data_source,
          event.confidence_level,
          event.follow_up_required,
          event.resolution_status
        ]);
      }
    }
    
    console.log(`   ✓ Inserted ${events.length} collision events`);
    
  } catch (error) {
    console.error('Error seeding collision events:', error);
    throw error;
  }
}

module.exports = { seed };