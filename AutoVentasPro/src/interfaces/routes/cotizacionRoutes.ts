import { Router } from 'express';
import { CotizacionController } from '../controllers/CotizacionController.js';
import { CotizacionService } from '../../application/services/CotizacionService.js';
import { CotizacionSupabaseRepository } from '../../infrastructure/repositories/cotizacion.supabase.repository.js';
import { VehiculoSupabaseRepository } from '../../infrastructure/repositories/vehiculo.supabase.repository.js';
import { PlanFinanciamientoSupabaseRepository } from '../../infrastructure/repositories/plan.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const cotizacionRepo = new CotizacionSupabaseRepository();
const vehiculoRepo = new VehiculoSupabaseRepository();
const planRepo = new PlanFinanciamientoSupabaseRepository();
const service = new CotizacionService(cotizacionRepo, vehiculoRepo, planRepo);
const controller = new CotizacionController(service);

const router = Router();

router.post('/simular', controller.simular);
router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.patch('/:id/estado', authenticate, authorize('administrador', 'jefe_ventas'), controller.cambiarEstado);
router.delete('/:id', authenticate, authorize('administrador'), controller.eliminar);

export { router as CotizacionRoutes };
