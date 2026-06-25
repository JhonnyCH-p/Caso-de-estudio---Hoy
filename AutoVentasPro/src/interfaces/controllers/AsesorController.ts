

import type { Request, Response } from 'express';
import type { AsesorService } from '../../application/services/AsesorService.js';

export class AsesorController {
  constructor(private service: AsesorService) {}

  // POST /asesores
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.createAsesor(req.body);
      res.status(201).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  // GET /asesores
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getAllAsesores();
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(500).json({ ok: false, message: error.message });
    }
  };

  // GET /asesores/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getAsesorById(req.params.id);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(404).json({ ok: false, message: error.message });
    }
  };

  // PUT /asesores/:id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.updateAsesor(req.params.id, req.body);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  // DELETE /asesores/:id
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deleteAsesor(req.params.id);
      res.status(200).json({ ok: true, message: 'Asesor eliminado correctamente' });
    } catch (error: any) {
      res.status(404).json({ ok: false, message: error.message });
    }
  };

  // POST /asesores/:id/comision
  calcularComision = async (req: Request, res: Response): Promise<void> => {
    try {
      const montoVenta = Number(req.body.montoVenta);
      if (isNaN(montoVenta)) {
        res.status(400).json({ ok: false, message: 'montoVenta debe ser un número' });
        return;
      }
      const result = await this.service.calcularComision(req.params.id, montoVenta);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  // GET /asesores/especialidad/:especialidad
  getByEspecialidad = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getAseforesByEspecialidad(req.params.especialidad);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  // GET /asesores/experiencia/:anios
  getByExperiencia = async (req: Request, res: Response): Promise<void> => {
    try {
      const anios = Number(req.params.anios);
      if (isNaN(anios)) {
        res.status(400).json({ ok: false, message: 'anios debe ser un número' });
        return;
      }
      const result = await this.service.getAsesoresByExperiencia(anios);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };
}