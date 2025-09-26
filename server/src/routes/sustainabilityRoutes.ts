import { Router } from 'express';
import sustainabilityController from '../controllers/sustainabilityController';

const router = Router();

// Sustainability analysis endpoints
router.post('/collision-risk', sustainabilityController.assessCollisionRisk);
router.get('/debris-density/:altitude', sustainabilityController.getDebrisDensity);
router.post('/deorbit-analysis', sustainabilityController.analyzeDeorbitOptions);

export default router;