import { Router } from 'express';
import { PlanFinanciamientoController } from '../controllers/PlanFinanciamientoController.js';
import { PlanFinanciamientoService } from '../../application/services/PlanFinanciamientoService.js';
import { PlanFinanciamientoSupabaseRepository } from '../../infrastructure/repositories/plan.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const repository = new PlanFinanciamientoSupabaseRepository();
const service = new PlanFinanciamientoService(repository);
const controller = new PlanFinanciamientoController(service);

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/:id/calcular-cuota', controller.calcularCuota);

router.post('/', authenticate, authorize('administrador', 'jefe_ventas'), controller.crear);
router.put('/:id', authenticate, authorize('administrador', 'jefe_ventas'), controller.actualizar);
router.delete('/:id', authenticate, authorize('administrador'), controller.eliminar);

export { router as PlanRoutes };
