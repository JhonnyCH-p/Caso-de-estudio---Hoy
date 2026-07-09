import { Router } from 'express';
import { VentaController } from '../controllers/VentaController.js';
import { VentaService } from '../../application/services/VentaService.js';
import { VentaSupabaseRepository } from '../../infrastructure/repositories/venta.supabase.repository.js';
import { CotizacionSupabaseRepository } from '../../infrastructure/repositories/cotizacion.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const ventaRepo = new VentaSupabaseRepository();
const cotizacionRepo = new CotizacionSupabaseRepository();
const service = new VentaService(ventaRepo, cotizacionRepo);
const controller = new VentaController(service);

const router = Router();

router.use(authenticate);

router.post('/', authorize('administrador', 'jefe_ventas'), controller.crear);
router.get('/', authorize('administrador', 'jefe_ventas', 'asesor'), controller.listar);
router.get('/stats', authorize('administrador', 'jefe_ventas'), controller.estadisticas);
router.get('/asesor/:asesorId', authorize('administrador', 'jefe_ventas', 'asesor'), controller.porAsesor);
router.get('/:id', authorize('administrador', 'jefe_ventas', 'asesor'), controller.obtenerPorId);
router.patch('/:id/estado', authorize('administrador', 'jefe_ventas'), controller.cambiarEstado);
router.delete('/:id', authorize('administrador'), controller.eliminar);

export { router as VentaRoutes };
