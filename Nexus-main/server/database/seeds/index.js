const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://orbital_user:orbital_password@localhost:5432/orbital_nexus'
});

async function runSeeds() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Get all seed files in order
    const seedFiles = [
      '01_seed_satellite_configurations.js',
      '02_seed_launch_vehicles.js', 
      '03_seed_orbital_shells.js',
      '04_seed_collision_events.js',
      '05_seed_active_satellites.js',
      '06_seed_financial_data.js',
      '07_seed_sustainability_scores.js'
    ];
    
    for (const seedFile of seedFiles) {
      const seedPath = path.join(__dirname, seedFile);
      if (fs.existsSync(seedPath)) {
        console.log(`📦 Running ${seedFile}...`);
        const seedModule = require(seedPath);
        await seedModule.seed(client);
        console.log(`✅ Completed ${seedFile}`);
      }
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  runSeeds().catch(console.error);
}

module.exports = { runSeeds };