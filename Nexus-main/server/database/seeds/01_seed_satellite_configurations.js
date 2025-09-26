const faker = require('faker');

const manufacturers = [
  'SSL (Space Systems Loral)',
  'Airbus Defence and Space',
  'Blue Canyon Technologies',
  'Thales Alenia Space',
  'Northrop Grumman',
  'Lockheed Martin',
  'Boeing Satellite Systems',
  'Planet Labs',
  'Maxar Technologies',
  'Ball Aerospace',
  'Surrey Satellite Technology',
  'Clyde Space',
  'GomSpace',
  'EnduroSat',
  'AAC Clyde Space'
];

const missionTypes = [
  'Earth Observation',
  'Communications',
  'Navigation',
  'Scientific Research',
  'Technology Demonstration',
  'Weather Monitoring',
  'Reconnaissance',
  'Internet Constellation',
  'IoT Connectivity',
  'Disaster Monitoring'
];

const propulsionTypes = [
  'Chemical Propulsion',
  'Electric Propulsion',
  'Ion Thruster',
  'Hall Effect Thruster',
  'Cold Gas Thruster',
  'Hydrazine Thruster',
  'Green Propellant',
  'Hybrid Propulsion',
  'None'
];

const communicationBands = [
  ['L-band', 'S-band'],
  ['C-band', 'Ku-band'],
  ['Ka-band', 'V-band'],
  ['X-band', 'Ku-band'],
  ['S-band', 'X-band'],
  ['UHF', 'VHF'],
  ['Ka-band'],
  ['Ku-band'],
  ['L-band'],
  ['S-band', 'C-band', 'X-band']
];

function generateSatelliteConfiguration() {
  const massKg = faker.datatype.float({ min: 1, max: 6000, precision: 0.1 });
  const powerWatts = faker.datatype.float({ min: 10, max: 15000, precision: 0.1 });
  const payloadCapacityKg = faker.datatype.float({ min: 0.5, max: massKg * 0.4, precision: 0.1 });
  const operationalLifetimeYears = faker.datatype.float({ min: 1, max: 15, precision: 0.5 });
  const costUsd = faker.datatype.number({ min: 500000, max: 500000000 });
  
  return {
    name: `${faker.company.companyName()} ${faker.random.alphaNumeric(3).toUpperCase()}-${faker.datatype.number({ min: 100, max: 999 })}`,
    mass_kg: massKg,
    power_watts: powerWatts,
    payload_capacity_kg: payloadCapacityKg,
    operational_lifetime_years: operationalLifetimeYears,
    propulsion_type: faker.random.arrayElement(propulsionTypes),
    communication_bands: faker.random.arrayElement(communicationBands),
    mission_type: faker.random.arrayElement(missionTypes),
    manufacturer: faker.random.arrayElement(manufacturers),
    cost_usd: costUsd,
    launch_readiness_level: faker.datatype.number({ min: 1, max: 9 })
  };
}

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE satellite_configurations RESTART IDENTITY CASCADE');
    
    const configurations = [];
    
    // Generate 60 satellite configurations
    for (let i = 0; i < 60; i++) {
      configurations.push(generateSatelliteConfiguration());
    }
    
    // Insert configurations in batches
    const batchSize = 10;
    for (let i = 0; i < configurations.length; i += batchSize) {
      const batch = configurations.slice(i, i + batchSize);
      const values = batch.map((config, index) => {
        const baseIndex = i + index;
        return `($${baseIndex * 11 + 1}, $${baseIndex * 11 + 2}, $${baseIndex * 11 + 3}, $${baseIndex * 11 + 4}, $${baseIndex * 11 + 5}, $${baseIndex * 11 + 6}, $${baseIndex * 11 + 7}, $${baseIndex * 11 + 8}, $${baseIndex * 11 + 9}, $${baseIndex * 11 + 10}, $${baseIndex * 11 + 11})`;
      }).join(', ');
      
      const flatValues = batch.flatMap(config => [
        config.name,
        config.mass_kg,
        config.power_watts,
        config.payload_capacity_kg,
        config.operational_lifetime_years,
        config.propulsion_type,
        config.communication_bands,
        config.mission_type,
        config.manufacturer,
        config.cost_usd,
        config.launch_readiness_level
      ]);
      
      const query = `
        INSERT INTO satellite_configurations (
          name, mass_kg, power_watts, payload_capacity_kg, operational_lifetime_years,
          propulsion_type, communication_bands, mission_type, manufacturer, cost_usd, launch_readiness_level
        ) VALUES ${values}
      `;
      
      await client.query(query, flatValues);
    }
    
    console.log(`   ✓ Inserted ${configurations.length} satellite configurations`);
    
  } catch (error) {
    console.error('Error seeding satellite configurations:', error);
    throw error;
  }
}

module.exports = { seed };