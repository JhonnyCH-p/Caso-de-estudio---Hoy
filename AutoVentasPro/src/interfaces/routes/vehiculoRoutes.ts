import { Router } from 'express';
import { VehiculoController } from '../controllers/VehiculoController.js';
import { VehiculoService } from '../../application/services/VehiculoService.js';
import { VehiculoSupabaseRepository } from '../../infrastructure/repositories/vehiculo.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const repository = new VehiculoSupabaseRepository();
const service = new VehiculoService(repository);
const controller = new VehiculoController(service);

const router = Router();

router.get('/', controller.listar);
router.get('/stats', controller.estadisticas);
router.get('/:id', controller.obtenerPorId);

router.post('/', authenticate, authorize('administrador', 'jefe_ventas'), controller.crear);
router.put('/:id', authenticate, authorize('administrador', 'jefe_ventas'), controller.actualizar);
router.delete('/:id', authenticate, authorize('administrador'), controller.eliminar);
router.patch('/:id/stock', authenticate, authorize('administrador', 'jefe_ventas'), controller.ajustarStock);

export { router as VehiculoRoutes };
