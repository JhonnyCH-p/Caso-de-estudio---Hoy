import type { Request, Response } from 'express';
import type { EmpleadoService } from '../../application/services/EmpleadoService.js';

export class EmpleadoController {
    constructor(private service: EmpleadoService) {}

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.crearEmpleado(req.body);
            res.status(201).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    listar = async (req: Request, res: Response): Promise<void> => {
        try {
            const activos = req.query.activos === 'true';
            const data = await this.service.listarEmpleados(activos);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.obtenerEmpleadoPorId(req.params.id);
            res.status(200).json({ data });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    actualizar = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.actualizarEmpleado(req.params.id, req.body);
            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    eliminar = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.eliminarEmpleado(req.params.id);
            res.status(200).json({ data: { message: 'Empleado eliminado correctamente' } });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    aumentarSalario = async (req: Request, res: Response): Promise<void> => {
        try {
            const percentage = Number(req.body.percentage);
            if (isNaN(percentage)) {
                res.status(400).json({ error: 'percentage debe ser un número' });
                return;
            }
            const data = await this.service.aumentarSalario(req.params.id, percentage);
            res.status(200).json({ data });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    estadisticas = async (_req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.obtenerEstadisticas();
            res.status(200).json({ data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
