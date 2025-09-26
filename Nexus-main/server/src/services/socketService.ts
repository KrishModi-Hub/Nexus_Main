// server/src/services/socketService.ts

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

/**
 * Initializes the WebSocket server and attaches it to the existing HTTP server.
 * It sets up timers to broadcast simulated space data to all connected clients.
 * @param {http.Server} server - The HTTP server instance to attach the WebSocket server to.
 */
export const initializeWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('🛰️  New client connected to Orbital Nexus WebSocket.');

    ws.on('close', () => {
      console.log('Client has disconnected.');
    });

    ws.on('error', console.error);
  });

  /**
   * Broadcasts a JSON message to every connected and ready client.
   * @param {object} data - The data object to be sent.
   */
  const broadcast = (data: object) => {
    const jsonData = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonData);
      }
    });
  };

  // ---=== Timers for Broadcasting Simulated Data ===---

  // Debris Update: Every 10 seconds
  setInterval(() => {
    broadcast({
      event: 'debris:update',
      payload: {
        altitude_km: 550,
        new_density: 1.23e-5,
        timestamp: new Date().toISOString(),
      },
    });
  }, 10000);

  // Conjunction Warning: Every 30 seconds
  setInterval(() => {
    broadcast({
      event: 'conjunction:warning',
      payload: {
        object1_norad: 25544, // ISS
        object2_norad: 43135, // A defunct satellite
        closest_approach_km: 0.85,
        probability: 0.002,
        timestamp: new Date().toISOString(),
      },
    });
  }, 30000);

  // Launch Status: Every 60 seconds
  setInterval(() => {
    broadcast({
      event: 'launch:status',
      payload: {
        mission: 'Starlink Group 10-2',
        provider: 'SpaceX',
        status: 'T-15 minutes and holding',
        timestamp: new Date().toISOString(),
      },
    });
  }, 60000);

  console.log('✅ WebSocket service initialized and broadcasting simulated data.');
};
