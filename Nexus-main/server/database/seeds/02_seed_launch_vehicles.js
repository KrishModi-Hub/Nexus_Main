const faker = require('faker');

const launchVehicles = [
  {
    name: 'Falcon 9',
    manufacturer: 'SpaceX',
    payload_capacity_leo_kg: 22800,
    payload_capacity_gto_kg: 8300,
    launch_cost_usd: 67000000,
    reliability_percentage: 98.5,
    first_flight_date: '2010-06-04',
    total_flights: 200,
    successful_flights: 197,
    fairing_diameter_m: 5.2,
    fairing_height_m: 13.1,
    reusable: true,
    active_status: true
  },
  {
    name: 'Falcon Heavy',
    manufacturer: 'SpaceX',
    payload_capacity_leo_kg: 63800,
    payload_capacity_gto_kg: 26700,
    launch_cost_usd: 97000000,
    reliability_percentage: 100.0,
    first_flight_date: '2018-02-06',
    total_flights: 8,
    successful_flights: 8,
    fairing_diameter_m: 5.2,
    fairing_height_m: 13.1,
    reusable: true,
    active_status: true
  },
  {
    name: 'Electron',
    manufacturer: 'Rocket Lab',
    payload_capacity_leo_kg: 320,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 7500000,
    reliability_percentage: 94.1,
    first_flight_date: '2017-05-25',
    total_flights: 34,
    successful_flights: 32,
    fairing_diameter_m: 1.2,
    fairing_height_m: 2.5,
    reusable: false,
    active_status: true
  },
  {
    name: 'Atlas V 401',
    manufacturer: 'United Launch Alliance',
    payload_capacity_leo_kg: 9800,
    payload_capacity_gto_kg: 4750,
    launch_cost_usd: 109000000,
    reliability_percentage: 100.0,
    first_flight_date: '2002-08-21',
    total_flights: 95,
    successful_flights: 95,
    fairing_diameter_m: 4.2,
    fairing_height_m: 12.2,
    reusable: false,
    active_status: true
  },
  {
    name: 'Delta IV Heavy',
    manufacturer: 'United Launch Alliance',
    payload_capacity_leo_kg: 28790,
    payload_capacity_gto_kg: 14220,
    launch_cost_usd: 350000000,
    reliability_percentage: 100.0,
    first_flight_date: '2004-12-21',
    total_flights: 15,
    successful_flights: 15,
    fairing_diameter_m: 5.1,
    fairing_height_m: 19.1,
    reusable: false,
    active_status: true
  },
  {
    name: 'Ariane 6-62',
    manufacturer: 'ArianeGroup',
    payload_capacity_leo_kg: 21650,
    payload_capacity_gto_kg: 11500,
    launch_cost_usd: 90000000,
    reliability_percentage: 95.0,
    first_flight_date: '2024-07-09',
    total_flights: 3,
    successful_flights: 3,
    fairing_diameter_m: 5.4,
    fairing_height_m: 20.0,
    reusable: false,
    active_status: true
  },
  {
    name: 'Soyuz 2.1b',
    manufacturer: 'Roscosmos',
    payload_capacity_leo_kg: 8200,
    payload_capacity_gto_kg: 3250,
    launch_cost_usd: 48000000,
    reliability_percentage: 97.8,
    first_flight_date: '2006-12-27',
    total_flights: 85,
    successful_flights: 83,
    fairing_diameter_m: 4.1,
    fairing_height_m: 11.4,
    reusable: false,
    active_status: true
  },
  {
    name: 'Long March 3B',
    manufacturer: 'CASC',
    payload_capacity_leo_kg: 11500,
    payload_capacity_gto_kg: 5500,
    launch_cost_usd: 70000000,
    reliability_percentage: 96.2,
    first_flight_date: '1996-02-14',
    total_flights: 78,
    successful_flights: 75,
    fairing_diameter_m: 4.0,
    fairing_height_m: 12.3,
    reusable: false,
    active_status: true
  },
  {
    name: 'H3-24L',
    manufacturer: 'JAXA/MHI',
    payload_capacity_leo_kg: 6500,
    payload_capacity_gto_kg: 4000,
    launch_cost_usd: 51000000,
    reliability_percentage: 66.7,
    first_flight_date: '2023-03-07',
    total_flights: 3,
    successful_flights: 2,
    fairing_diameter_m: 4.0,
    fairing_height_m: 15.0,
    reusable: false,
    active_status: true
  },
  {
    name: 'PSLV-XL',
    manufacturer: 'ISRO',
    payload_capacity_leo_kg: 3800,
    payload_capacity_gto_kg: 1750,
    launch_cost_usd: 28000000,
    reliability_percentage: 94.9,
    first_flight_date: '2008-10-22',
    total_flights: 25,
    successful_flights: 24,
    fairing_diameter_m: 3.2,
    fairing_height_m: 8.3,
    reusable: false,
    active_status: true
  },
  {
    name: 'Vega C',
    manufacturer: 'Avio',
    payload_capacity_leo_kg: 2300,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 35000000,
    reliability_percentage: 50.0,
    first_flight_date: '2022-07-13',
    total_flights: 2,
    successful_flights: 1,
    fairing_diameter_m: 2.6,
    fairing_height_m: 7.8,
    reusable: false,
    active_status: true
  },
  {
    name: 'Neutron',
    manufacturer: 'Rocket Lab',
    payload_capacity_leo_kg: 13000,
    payload_capacity_gto_kg: 2000,
    launch_cost_usd: 50000000,
    reliability_percentage: null,
    first_flight_date: null,
    total_flights: 0,
    successful_flights: 0,
    fairing_diameter_m: 5.0,
    fairing_height_m: 13.0,
    reusable: true,
    active_status: false
  },
  {
    name: 'New Glenn',
    manufacturer: 'Blue Origin',
    payload_capacity_leo_kg: 45000,
    payload_capacity_gto_kg: 13000,
    launch_cost_usd: 68000000,
    reliability_percentage: null,
    first_flight_date: null,
    total_flights: 0,
    successful_flights: 0,
    fairing_diameter_m: 7.0,
    fairing_height_m: 19.5,
    reusable: true,
    active_status: false
  },
  {
    name: 'Vulcan Centaur',
    manufacturer: 'United Launch Alliance',
    payload_capacity_leo_kg: 27200,
    payload_capacity_gto_kg: 14000,
    launch_cost_usd: 110000000,
    reliability_percentage: 100.0,
    first_flight_date: '2024-01-08',
    total_flights: 2,
    successful_flights: 2,
    fairing_diameter_m: 5.4,
    fairing_height_m: 21.3,
    reusable: false,
    active_status: true
  },
  {
    name: 'Starship',
    manufacturer: 'SpaceX',
    payload_capacity_leo_kg: 150000,
    payload_capacity_gto_kg: 21000,
    launch_cost_usd: 10000000,
    reliability_percentage: null,
    first_flight_date: null,
    total_flights: 0,
    successful_flights: 0,
    fairing_diameter_m: 9.0,
    fairing_height_m: 22.0,
    reusable: true,
    active_status: false
  },
  {
    name: 'Firefly Alpha',
    manufacturer: 'Firefly Aerospace',
    payload_capacity_leo_kg: 1170,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 15000000,
    reliability_percentage: 50.0,
    first_flight_date: '2021-09-02',
    total_flights: 4,
    successful_flights: 2,
    fairing_diameter_m: 1.8,
    fairing_height_m: 3.5,
    reusable: false,
    active_status: true
  },
  {
    name: 'LauncherOne',
    manufacturer: 'Virgin Orbit',
    payload_capacity_leo_kg: 500,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 12000000,
    reliability_percentage: 40.0,
    first_flight_date: '2020-05-25',
    total_flights: 5,
    successful_flights: 2,
    fairing_diameter_m: 1.6,
    fairing_height_m: 3.0,
    reusable: false,
    active_status: false
  },
  {
    name: 'Terran 1',
    manufacturer: 'Relativity Space',
    payload_capacity_leo_kg: 1250,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 12000000,
    reliability_percentage: 0.0,
    first_flight_date: '2023-03-22',
    total_flights: 1,
    successful_flights: 0,
    fairing_diameter_m: 2.2,
    fairing_height_m: 3.3,
    reusable: false,
    active_status: false
  },
  {
    name: 'Astra Rocket 3',
    manufacturer: 'Astra',
    payload_capacity_leo_kg: 500,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 2500000,
    reliability_percentage: 14.3,
    first_flight_date: '2020-09-11',
    total_flights: 7,
    successful_flights: 1,
    fairing_diameter_m: 1.3,
    fairing_height_m: 2.5,
    reusable: false,
    active_status: false
  },
  {
    name: 'RS1',
    manufacturer: 'ABL Space Systems',
    payload_capacity_leo_kg: 1350,
    payload_capacity_gto_kg: null,
    launch_cost_usd: 12000000,
    reliability_percentage: 0.0,
    first_flight_date: '2023-01-10',
    total_flights: 1,
    successful_flights: 0,
    fairing_diameter_m: 2.4,
    fairing_height_m: 4.0,
    reusable: false,
    active_status: true
  }
];

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE launch_vehicles RESTART IDENTITY CASCADE');
    
    // Insert launch vehicles
    for (const vehicle of launchVehicles) {
      const query = `
        INSERT INTO launch_vehicles (
          name, manufacturer, payload_capacity_leo_kg, payload_capacity_gto_kg,
          launch_cost_usd, reliability_percentage, first_flight_date, total_flights,
          successful_flights, fairing_diameter_m, fairing_height_m, reusable, active_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;
      
      await client.query(query, [
        vehicle.name,
        vehicle.manufacturer,
        vehicle.payload_capacity_leo_kg,
        vehicle.payload_capacity_gto_kg,
        vehicle.launch_cost_usd,
        vehicle.reliability_percentage,
        vehicle.first_flight_date,
        vehicle.total_flights,
        vehicle.successful_flights,
        vehicle.fairing_diameter_m,
        vehicle.fairing_height_m,
        vehicle.reusable,
        vehicle.active_status
      ]);
    }
    
    console.log(`   ✓ Inserted ${launchVehicles.length} launch vehicles`);
    
  } catch (error) {
    console.error('Error seeding launch vehicles:', error);
    throw error;
  }
}

module.exports = { seed };