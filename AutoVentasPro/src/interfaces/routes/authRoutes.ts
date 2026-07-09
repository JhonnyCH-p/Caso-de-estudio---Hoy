import { Router } from 'express';
import { AuthService } from '../../application/services/AuthService.js';
import { AuthController } from '../controllers/AuthController.js';
import { UsuarioSupabaseRepository } from '../../infrastructure/repositories/usuario.supabase.repository.js';
import { authenticate } from '../../infrastructure/auth/jwt.middleware.js';

const repository = new UsuarioSupabaseRepository();
const authService = new AuthService(repository);
const controller = new AuthController(authService);

const router = Router();

router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);

export { router as AuthRoutes };
