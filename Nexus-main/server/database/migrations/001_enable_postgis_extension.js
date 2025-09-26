/**
 * Enable PostGIS extension for spatial data support
 */

exports.up = (pgm) => {
  // Enable PostGIS extension
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis;');
  
  // Enable PostGIS topology extension (optional but useful)
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis_topology;');
  
  // Enable PostGIS raster extension (optional)
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis_raster;');
};

exports.down = (pgm) => {
  // Drop extensions in reverse order
  pgm.sql('DROP EXTENSION IF EXISTS postgis_raster;');
  pgm.sql('DROP EXTENSION IF EXISTS postgis_topology;');
  pgm.sql('DROP EXTENSION IF EXISTS postgis;');
};