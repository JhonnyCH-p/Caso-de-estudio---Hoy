import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/UploadController.js';
import { authenticate, authorize } from '../../infrastructure/auth/jwt.middleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const controller = new UploadController();

const router = Router();

router.post('/', authenticate, authorize('administrador', 'jefe_ventas'), upload.single('file'), controller.upload);

export { router as UploadRoutes };
