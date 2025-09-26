# Orbital Nexus Database Migrations

This directory contains the database schema and migration files for the Orbital Nexus project using node-pg-migrate.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your database connection in `.pgmigrate.json` or set the `DATABASE_URL` environment variable.

## Migration Files

The migrations are organized logically by functionality:

1. **001_enable_postgis_extension.js** - Enables PostGIS spatial extensions
2. **002_create_mission_planning_tables.js** - Core mission planning tables (satellite_configurations, launch_vehicles, orbital_shells)
3. **003_create_collision_events_table.js** - Collision tracking and space debris events
4. **004_create_financial_modeling_tables.js** - Cost modeling and insurance data (cost_components, insurance_models)
5. **005_create_sustainability_and_tracking_tables.js** - Sustainability scoring and active satellite tracking
6. **006_create_additional_tracking_tables.js** - Extended tracking capabilities (orbital_debris, conjunction_assessments, mission_profiles)

## Usage

### Run all pending migrations:
```bash
npm run migrate:up
```

### Rollback the last migration:
```bash
npm run migrate:down
```

### Create a new migration:
```bash
npm run migrate:create -- migration_name
```

### Check migration status:
```bash
npm run migrate -- --help
```

### Seed the database:
```bash
npm run seed
```

### Seed for development:
```bash
npm run seed:dev
```

## Database Schema Overview

### Core Tables:
- `satellite_configurations` - Satellite specifications and capabilities
- `launch_vehicles` - Launch vehicle specifications and performance data
- `orbital_shells` - Orbital altitude bands and capacity management
- `active_satellites` - Currently operational satellites with real-time tracking
- `collision_events` - Historical and predicted collision events
- `orbital_debris` - Space debris catalog and tracking
- `conjunction_assessments` - Close approach analysis and risk assessment
- `mission_profiles` - Mission planning and constellation management
- `cost_components` - Financial modeling components
- `insurance_models` - Insurance coverage and risk models
- `sustainability_scores` - Environmental and sustainability metrics

### Key Features:
- PostGIS spatial data support for orbital mechanics
- Comprehensive collision avoidance and debris tracking
- Financial modeling and insurance integration
- Sustainability scoring and environmental impact assessment
- Real-time satellite tracking and status monitoring
- Mission lifecycle management

## Environment Variables

Set these environment variables or update `.pgmigrate.json`:

- `DATABASE_URL` - Full PostgreSQL connection string
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

## Notes

- All tables include `created_at` and `updated_at` timestamps
- Spatial data uses SRID 4326 (WGS84) coordinate system
- Range types are used for altitude and other continuous data
- JSONB is used for flexible schema components
- Comprehensive indexing for performance optimization
- Foreign key constraints maintain referential integrity