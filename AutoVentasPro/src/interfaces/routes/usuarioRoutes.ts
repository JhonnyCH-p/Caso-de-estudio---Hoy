import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioService } from '../../application/services/UsuarioService.js';
import { UsuarioSupabaseRepository } from '../../infrastructure/repositories/usuario.supabase.repository.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const repository = new UsuarioSupabaseRepository();
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

const router = Router();

router.post('/login', controller.login);

router.use(authenticate);
router.use(authorize('administrador'));

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/estadisticas', controller.estadisticas);
router.get('/rol/:rol', controller.buscarPorRol);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);
router.post('/:id/comision', controller.calcularComision);

export { router as UsuarioRoutes };
