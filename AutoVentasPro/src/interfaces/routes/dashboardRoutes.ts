import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController.js';
import { DashboardService } from '../../application/services/DashboardService.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const service = new DashboardService();
const controller = new DashboardController(service);

const router = Router();

router.use(authenticate);
router.use(authorize('administrador', 'jefe_ventas'));

router.get('/', controller.obtenerDashboard);

export { router as DashboardRoutes };
