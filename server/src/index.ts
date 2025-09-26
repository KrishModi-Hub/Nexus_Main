@@ .. @@
 // Import routes
 import missionRoutes from './routes/missionRoutes';
+import costRoutes from './routes/costRoutes';
+import sustainabilityRoutes from './routes/sustainabilityRoutes';
 
 // Import middleware
@@ .. @@
 // API routes
 app.use('/api/missions', missionRoutes);
+app.use('/api/calculator', costRoutes);
+app.use('/api/sustainability', sustainabilityRoutes);
 
 // 404 handler