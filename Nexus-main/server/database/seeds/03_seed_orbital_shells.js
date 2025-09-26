const orbitalShells = [
  {
    name: 'Very Low Earth Orbit (VLEO)',
    altitude_range_km: '[200,400)',
    inclination_deg: 97.4,
    orbital_period_minutes: 92.5,
    max_satellites: 500,
    current_satellites: 45,
    debris_density_level: 'MEDIUM',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.35,
    sustainability_rating: 'B'
  },
  {
    name: 'Low Earth Orbit - Lower',
    altitude_range_km: '[400,500)',
    inclination_deg: 53.0,
    orbital_period_minutes: 94.2,
    max_satellites: 2000,
    current_satellites: 1247,
    debris_density_level: 'HIGH',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.68,
    sustainability_rating: 'C'
  },
  {
    name: 'Low Earth Orbit - Mid',
    altitude_range_km: '[500,600)',
    inclination_deg: 97.6,
    orbital_period_minutes: 96.1,
    max_satellites: 1800,
    current_satellites: 892,
    debris_density_level: 'HIGH',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.72,
    sustainability_rating: 'C'
  },
  {
    name: 'Starlink Primary Shell',
    altitude_range_km: '[540,570)',
    inclination_deg: 53.2,
    orbital_period_minutes: 95.8,
    max_satellites: 4400,
    current_satellites: 3200,
    debris_density_level: 'CRITICAL',
    regulatory_framework: 'FCC Part 25',
    collision_risk_score: 0.85,
    sustainability_rating: 'D'
  },
  {
    name: 'Sun-Synchronous Orbit',
    altitude_range_km: '[600,800)',
    inclination_deg: 98.2,
    orbital_period_minutes: 97.8,
    max_satellites: 1200,
    current_satellites: 456,
    debris_density_level: 'MEDIUM',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.42,
    sustainability_rating: 'B'
  },
  {
    name: 'Low Earth Orbit - Upper',
    altitude_range_km: '[800,1000)',
    inclination_deg: 86.4,
    orbital_period_minutes: 101.2,
    max_satellites: 800,
    current_satellites: 234,
    debris_density_level: 'MEDIUM',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.38,
    sustainability_rating: 'B'
  },
  {
    name: 'Polar Orbit',
    altitude_range_km: '[800,900)',
    inclination_deg: 90.0,
    orbital_period_minutes: 100.5,
    max_satellites: 600,
    current_satellites: 123,
    debris_density_level: 'LOW',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.25,
    sustainability_rating: 'A'
  },
  {
    name: 'OneWeb Shell',
    altitude_range_km: '[1200,1200]',
    inclination_deg: 87.9,
    orbital_period_minutes: 109.8,
    max_satellites: 648,
    current_satellites: 634,
    debris_density_level: 'MEDIUM',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.45,
    sustainability_rating: 'B'
  },
  {
    name: 'Medium Earth Orbit - Lower',
    altitude_range_km: '[1400,2000)',
    inclination_deg: 55.0,
    orbital_period_minutes: 127.5,
    max_satellites: 400,
    current_satellites: 67,
    debris_density_level: 'LOW',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.18,
    sustainability_rating: 'A'
  },
  {
    name: 'GPS/GLONASS Shell',
    altitude_range_km: '[20000,20500)',
    inclination_deg: 55.0,
    orbital_period_minutes: 718.0,
    max_satellites: 100,
    current_satellites: 78,
    debris_density_level: 'LOW',
    regulatory_framework: 'ITU Radio Regulations',
    collision_risk_score: 0.12,
    sustainability_rating: 'A'
  }
];

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE orbital_shells RESTART IDENTITY CASCADE');
    
    // Insert orbital shells
    for (const shell of orbitalShells) {
      const query = `
        INSERT INTO orbital_shells (
          name, altitude_range_km, inclination_deg, orbital_period_minutes,
          max_satellites, current_satellites, debris_density_level,
          regulatory_framework, collision_risk_score, sustainability_rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      
      await client.query(query, [
        shell.name,
        shell.altitude_range_km,
        shell.inclination_deg,
        shell.orbital_period_minutes,
        shell.max_satellites,
        shell.current_satellites,
        shell.debris_density_level,
        shell.regulatory_framework,
        shell.collision_risk_score,
        shell.sustainability_rating
      ]);
    }
    
    console.log(`   ✓ Inserted ${orbitalShells.length} orbital shells`);
    
  } catch (error) {
    console.error('Error seeding orbital shells:', error);
    throw error;
  }
}

module.exports = { seed };