// src/infrastructure/controllers/vehiculo.controller.ts
import { Request, Response } from 'express';
import { VehiculoService } from '../../application/services/VehiculoService.js';
import { CreateVehiculoRequest, UpdateVehiculoRequest } from '../../application/dtos/requests/VehiculoRequest.js';

export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  // POST /api/vehiculos
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const request: CreateVehiculoRequest = req.body;
      const vehiculo = await this.vehiculoService.create(request);
      res.status(201).json({
        message: 'Vehículo creado exitosamente',
        data: vehiculo,
      });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // GET /api/vehiculos
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehiculos = await this.vehiculoService.getAll();
      res.status(200).json({
        count: vehiculos.length,
        data: vehiculos,
      });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // GET /api/vehiculos/disponibles
  getDisponibles = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehiculos = await this.vehiculoService.getDisponibles();
      res.status(200).json({
        count: vehiculos.length,
        data: vehiculos,
      });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // GET /api/vehiculos/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: 'ID es requerido' });
        return;
      }

      const vehiculo = await this.vehiculoService.getById(id);
      res.status(200).json({ data: vehiculo });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // PUT /api/vehiculos/:id
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: 'ID es requerido' });
        return;
      }

      const request: UpdateVehiculoRequest = req.body;
      if (Object.keys(request).length === 0) {
        res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
        return;
      }

      const vehiculo = await this.vehiculoService.update(id, request);
      res.status(200).json({
        message: 'Vehículo actualizado exitosamente',
        data: vehiculo,
      });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // DELETE /api/vehiculos/:id
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: 'ID es requerido' });
        return;
      }

      await this.vehiculoService.delete(id);
      res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // GET /api/vehiculos/marca/:marca (OPCIONAL - si tienes este endpoint)
  getByMarca = async (req: Request, res: Response): Promise<void> => {
    try {
      const marca = req.params.marca as string;
      if (!marca) {
        res.status(400).json({ error: 'Marca es requerida' });
        return;
      }
    } catch (error: any) {
      this.handleError(error, res);
    }
  };

  // Manejo errores
  private handleError(error: any, res: Response): void {
    console.error('Error en VehiculoController:', error.message);

    // Errores de validación
    if (error.message.includes('marca') ||
        error.message.includes('modelo') ||
        error.message.includes('año') ||
        error.message.includes('precio') ||
        error.message.includes('stock') ||
        error.message.includes('tipo')) {
      res.status(400).json({ error: error.message });
      return;
    }

    // no encontrado
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
}