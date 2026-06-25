// src/infrastructure/routes/vehiculo.routes.ts
import { Router } from 'express';
import { VehiculoController } from '../controllers/VehiculoController.js';

export const createVehiculoRoutes = (controller: VehiculoController): Router => {
  const router = Router();

  router.post('/', controller.create);
  router.get('/', controller.getAll);
  router.get('/disponibles', controller.getDisponibles);
  router.get('/:id', controller.getById);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};