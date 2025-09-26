import { Router } from 'express';
import missionController from '../controllers/missionController';

const router = Router();

// Mission CRUD operations
router.post('/create', missionController.createMission);
router.get('/:id', missionController.getMissionById);
router.put('/:id/update', missionController.updateMission);
router.delete('/:id', missionController.deleteMission);

// Mission analysis operations
router.post('/:id/simulate', missionController.simulateMission);
router.get('/:id/report', missionController.generateMissionReport);
router.post('/:id/optimize', missionController.optimizeMission);

export default router;