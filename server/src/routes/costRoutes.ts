import { Router } from 'express';
import costController from '../controllers/costController';

const router = Router();

// Cost estimation endpoints
router.post('/estimate', costController.generateCostEstimate);
router.get('/components', costController.getCostComponents);
router.post('/insurance-quote', costController.generateInsuranceQuote);

export default router;