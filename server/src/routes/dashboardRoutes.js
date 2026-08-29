import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/stats', getDashboardStats);

export default router;
