import { Request, Response } from 'express';
import { PlanFinanciamientoService } from '../../application/services/PlanFinanciamientoService.js';
import { PlanFinanciamientoRequest } from '../../application/dtos/requests/PlanFinanciamientoRequest.js';

export class PlanFinanciamientoController {
  constructor(private service: PlanFinanciamientoService) {}

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const data: PlanFinanciamientoRequest = req.body;
      const plan = await this.service.crearPlan(data);
      res.status(201).json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const activos = req.query.activos === 'true';
      const planes = await this.service.listarPlanes(activos);
      res.json(planes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await this.service.obtenerPlanPorId(id);
      if (!plan) {
        res.status(404).json({ error: 'Plan no encontrado' });
        return;
      }
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const plan = await this.service.actualizarPlan(id, data);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const fisico = req.query.fisico === 'true';
      const result = await this.service.eliminarPlan(id, fisico);
      res.json({ eliminado: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}