// server/src/index.ts (Updated Version)

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // <-- 1. Import http module

import missionRoutes from './routes/missionRoutes';
import costRoutes from './routes/costRoutes';
import sustainabilityRoutes from './routes/sustainabilityRoutes';
import { errorHandler } from './middleware/errorHandler';
import { initializeWebSocket } from './services/socketService'; // <-- 2. Import WebSocket service

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/missions', missionRoutes);
app.use('/api/calculator', costRoutes);
app.use('/api/sustainability', sustainabilityRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Orbital Nexus API is running...');
});

app.use(errorHandler);

// 3. Create an HTTP server from the Express app
const server = http.createServer(app);

// 4. Listen on the http server, not the Express app
server.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  
  // 5. Initialize the WebSocket service after the server starts
  initializeWebSocket(server);
});
