import { Router } from 'express';
import { EmpleadoController } from '../controllers/EmpleadoController.js';
import { EmpleadoService } from '../../application/services/EmpleadoService.js';
import { EmpleadoSupabaseRepository } from '../../infrastructure/repositories/empleado.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const repository = new EmpleadoSupabaseRepository();
const service = new EmpleadoService(repository);
const controller = new EmpleadoController(service);

const router = Router();

router.use(authenticate);

router.post('/', authorize('administrador'), controller.crear);
router.get('/', authorize('administrador', 'jefe_ventas'), controller.listar);
router.get('/stats', authorize('administrador', 'jefe_ventas'), controller.estadisticas);
router.get('/:id', authorize('administrador', 'jefe_ventas'), controller.obtenerPorId);
router.put('/:id', authorize('administrador'), controller.actualizar);
router.delete('/:id', authorize('administrador'), controller.eliminar);
router.patch('/:id/salary', authorize('administrador'), controller.aumentarSalario);

export { router as EmpleadoRoutes };
