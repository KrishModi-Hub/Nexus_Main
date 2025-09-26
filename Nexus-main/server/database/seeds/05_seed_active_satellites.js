const faker = require('faker');

const operators = [
  'SpaceX',
  'OneWeb',
  'Planet Labs',
  'Maxar Technologies',
  'Airbus Defence and Space',
  'Boeing',
  'Lockheed Martin',
  'Northrop Grumman',
  'Thales Alenia Space',
  'ISRO',
  'ESA',
  'JAXA',
  'CNSA',
  'Roscosmos',
  'SES',
  'Intelsat',
  'Eutelsat',
  'Telesat',
  'Viasat',
  'Hughes Network Systems'
];

const countries = [
  'United States',
  'United Kingdom',
  'France',
  'Germany',
  'Japan',
  'China',
  'Russia',
  'India',
  'Canada',
  'Italy',
  'Spain',
  'Netherlands',
  'Luxembourg',
  'Israel',
  'South Korea',
  'Australia',
  'Brazil',
  'Argentina',
  'Mexico',
  'Norway'
];

const missionTypes = [
  'Communications',
  'Earth Observation',
  'Navigation',
  'Weather Monitoring',
  'Scientific Research',
  'Technology Demonstration',
  'Internet Constellation',
  'Reconnaissance',
  'Disaster Monitoring',
  'IoT Connectivity',
  'Broadcasting',
  'Maritime Tracking',
  'Aviation Services',
  'Emergency Communications'
];

const launchVehicles = [
  'Falcon 9',
  'Atlas V',
  'Delta IV',
  'Ariane 5',
  'Ariane 6',
  'Soyuz',
  'Long March 3B',
  'H-IIA',
  'PSLV',
  'Electron',
  'Vega',
  'Proton-M'
];

const launchSites = [
  'Kennedy Space Center, FL',
  'Cape Canaveral SFS, FL',
  'Vandenberg SFB, CA',
  'Kourou, French Guiana',
  'Baikonur Cosmodrome, Kazakhstan',
  'Plesetsk Cosmodrome, Russia',
  'Xichang Satellite Launch Center, China',
  'Tanegashima Space Center, Japan',
  'Satish Dhawan Space Centre, India',
  'Rocket Lab Launch Complex, New Zealand',
  'Wallops Flight Facility, VA'
];

const operationalStatuses = ['OPERATIONAL', 'DEGRADED', 'NON_OPERATIONAL', 'DEORBITING', 'UNKNOWN'];
const deorbitPlanStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NOT_REQUIRED'];
const communicationStatuses = ['ACTIVE', 'INTERMITTENT', 'LOST', 'SCHEDULED_SILENCE'];

function generateStarlinkName(index) {
  const group = Math.floor(index / 60) + 1;
  const number = (index % 60) + 1;
  return `STARLINK-${group}-${number}`;
}

function generateOnWebName(index) {
  return `ONEWEB-${String(index).padStart(4, '0')}`;
}

function generateGenericName(operator, index) {
  const prefix = operator.replace(/\s+/g, '').toUpperCase().substring(0, 6);
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function generateActiveSatellite(index) {
  const operator = faker.random.arrayElement(operators);
  const launchDate = faker.date.between('2015-01-01', '2024-12-31');
  const currentAltitudeKm = faker.datatype.float({ min: 200, max: 2000, precision: 0.1 });
  const latitude = faker.datatype.float({ min: -90, max: 90, precision: 0.00001 });
  const longitude = faker.datatype.float({ min: -180, max: 180, precision: 0.00001 });
  
  // Generate realistic satellite names based on operator
  let name;
  if (operator === 'SpaceX') {
    name = generateStarlinkName(index);
  } else if (operator === 'OneWeb') {
    name = generateOnWebName(index);
  } else {
    name = generateGenericName(operator, index);
  }
  
  // Generate realistic NORAD ID (5-digit number)
  const satelliteId = faker.datatype.number({ min: 10000, max: 99999 }).toString();
  
  const massKg = faker.datatype.float({ min: 1, max: 6000, precision: 0.1 });
  const powerWatts = faker.datatype.float({ min: 10, max: 15000, precision: 0.1 });
  const expectedLifetimeYears = faker.datatype.float({ min: 1, max: 15, precision: 0.5 });
  
  // Calculate orbital period based on altitude (simplified Kepler's third law)
  const earthRadius = 6371; // km
  const mu = 398600.4418; // km³/s² (Earth's gravitational parameter)
  const semiMajorAxis = earthRadius + currentAltitudeKm;
  const orbitalPeriodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
  const orbitalPeriodMinutes = orbitalPeriodSeconds / 60;
  
  const currentInclination = faker.datatype.float({ min: 0, max: 180, precision: 0.00001 });
  const currentEccentricity = faker.datatype.float({ min: 0, max: 0.1, precision: 0.00000001 });
  
  const operationalStatus = faker.random.arrayElement(operationalStatuses);
  const hasCollisionAvoidance = faker.datatype.boolean();
  const hasPropulsion = faker.datatype.boolean();
  
  return {
    satellite_id: satelliteId,
    name: name,
    operator: operator,
    country_of_origin: faker.random.arrayElement(countries),
    launch_date: launchDate,
    launch_vehicle: faker.random.arrayElement(launchVehicles),
    launch_site: faker.random.arrayElement(launchSites),
    current_altitude_km: currentAltitudeKm,
    current_inclination_deg: currentInclination,
    current_eccentricity: currentEccentricity,
    orbital_period_minutes: orbitalPeriodMinutes,
    last_position_update: faker.date.recent(7),
    operational_status: operationalStatus,
    mission_type: faker.random.arrayElement(missionTypes),
    mass_kg: massKg,
    power_watts: powerWatts,
    expected_lifetime_years: expectedLifetimeYears,
    deorbit_plan_status: faker.random.arrayElement(deorbitPlanStatuses),
    collision_avoidance_capability: hasCollisionAvoidance,
    propulsion_capability: hasPropulsion,
    tracking_accuracy_m: faker.datatype.float({ min: 1, max: 1000, precision: 0.1 }),
    last_maneuver_date: hasPropulsion ? faker.date.recent(365) : null,
    total_maneuvers_performed: hasPropulsion ? faker.datatype.number({ min: 0, max: 50 }) : 0,
    fuel_remaining_kg: hasPropulsion ? faker.datatype.float({ min: 0, max: 100, precision: 0.01 }) : null,
    battery_health_percentage: faker.datatype.float({ min: 60, max: 100, precision: 0.1 }),
    communication_status: faker.random.arrayElement(communicationStatuses),
    last_contact_date: faker.date.recent(30),
    regulatory_licenses: [faker.random.arrayElement(['FCC', 'ITU', 'CEPT', 'ACMA', 'OFCOM'])],
    insurance_coverage_usd: faker.datatype.number({ min: 1000000, max: 500000000 }),
    latitude: latitude,
    longitude: longitude
  };
}

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE active_satellites RESTART IDENTITY CASCADE');
    
    const satellites = [];
    
    // Generate 600 active satellites
    for (let i = 0; i < 600; i++) {
      satellites.push(generateActiveSatellite(i));
    }
    
    // Insert satellites in batches
    const batchSize = 10;
    for (let i = 0; i < satellites.length; i += batchSize) {
      const batch = satellites.slice(i, i + batchSize);
      
      for (const satellite of batch) {
        const query = `
          INSERT INTO active_satellites (
            satellite_id, name, operator, country_of_origin, launch_date, launch_vehicle,
            launch_site, current_altitude_km, current_inclination_deg, current_eccentricity,
            orbital_period_minutes, current_position, last_position_update, operational_status,
            mission_type, mass_kg, power_watts, expected_lifetime_years, deorbit_plan_status,
            collision_avoidance_capability, propulsion_capability, tracking_accuracy_m,
            last_maneuver_date, total_maneuvers_performed, fuel_remaining_kg,
            battery_health_percentage, communication_status, last_contact_date,
            regulatory_licenses, insurance_coverage_usd
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            ST_SetSRID(ST_MakePoint($12, $13), 4326),
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
          )
        `;
        
        await client.query(query, [
          satellite.satellite_id,
          satellite.name,
          satellite.operator,
          satellite.country_of_origin,
          satellite.launch_date,
          satellite.launch_vehicle,
          satellite.launch_site,
          satellite.current_altitude_km,
          satellite.current_inclination_deg,
          satellite.current_eccentricity,
          satellite.orbital_period_minutes,
          satellite.longitude, // For ST_MakePoint (longitude first)
          satellite.latitude,  // For ST_MakePoint (latitude second)
          satellite.last_position_update,
          satellite.operational_status,
          satellite.mission_type,
          satellite.mass_kg,
          satellite.power_watts,
          satellite.expected_lifetime_years,
          satellite.deorbit_plan_status,
          satellite.collision_avoidance_capability,
          satellite.propulsion_capability,
          satellite.tracking_accuracy_m,
          satellite.last_maneuver_date,
          satellite.total_maneuvers_performed,
          satellite.fuel_remaining_kg,
          satellite.battery_health_percentage,
          satellite.communication_status,
          satellite.last_contact_date,
          satellite.regulatory_licenses,
          satellite.insurance_coverage_usd
        ]);
      }
    }
    
    console.log(`   ✓ Inserted ${satellites.length} active satellites`);
    
  } catch (error) {
    console.error('Error seeding active satellites:', error);
    throw error;
  }
}

module.exports = { seed };