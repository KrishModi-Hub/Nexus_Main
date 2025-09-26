# Orbital Nexus

A full-stack application with React frontend, Node.js/Express backend, and PostgreSQL with PostGIS database.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Development Setup

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at:
   - Client: http://localhost:3000
   - Server: http://localhost:8080
   - Database: localhost:5432

### Services

- **client**: React application running on port 3000
- **server**: Node.js/Express API running on port 8080
- **db**: PostgreSQL 15 with PostGIS extension running on port 5432

### Development Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up --build

# Execute commands in containers
docker-compose exec server npm run test
docker-compose exec client npm run test

# Access database
docker-compose exec db psql -U orbital_user -d orbital_nexus
```

### Directory Structure

```
orbital-nexus/
├── client/                 # React frontend application
├── server/                 # Node.js backend application
├── docker/                 # Docker configuration files
├── docker-compose.yml      # Docker Compose configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

### Environment Variables

Copy `.env.example` to `.env` and modify the values as needed for your development environment.

## Production Deployment

For production deployment, use the production target in the Dockerfile:

```bash
docker build -f docker/Dockerfile.client --target production -t orbital-nexus-client .
```