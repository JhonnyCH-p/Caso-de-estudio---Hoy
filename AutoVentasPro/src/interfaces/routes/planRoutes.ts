import { Router } from 'express';
import { PlanFinanciamientoController } from '../controllers/PlanFinanciamientoController.js';

export function createPlanRoutes(controller: PlanFinanciamientoController): Router {
  const router = Router();

  router.post('/', (req, res) => controller.crear(req, res));
  router.get('/', (req, res) => controller.listar(req, res));
  router.get('/:id', (req, res) => controller.obtenerPorId(req, res));
  router.put('/:id', (req, res) => controller.actualizar(req, res));
  router.delete('/:id', (req, res) => controller.eliminar(req, res));

  return router;
}