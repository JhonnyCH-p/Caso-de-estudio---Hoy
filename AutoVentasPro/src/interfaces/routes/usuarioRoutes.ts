import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioService } from '../../application/services/UsuarioService.js';
import { UsuarioInMemoryRepository } from '../../infrastructure/repositories/usuario.inmemory.repository.js';

const repository = new UsuarioInMemoryRepository();
const service = new UsuarioService(repository);
const controller = new UsuarioController(service);

const router = Router();

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/estadisticas', controller.estadisticas);
router.post('/login', controller.login);
router.get('/rol/:rol', controller.buscarPorRol);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);
router.post('/:id/comision', controller.calcularComision);

export { router as UsuarioRoutes };
