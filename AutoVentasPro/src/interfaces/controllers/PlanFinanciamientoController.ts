import type { Request, Response } from 'express';
import type { PlanFinanciamientoService } from '../../application/services/PlanFinanciamientoService.js';

export class PlanFinanciamientoController {
    constructor(private service: PlanFinanciamientoService) {}

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.crearPlan(req.body);
            res.status(201).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    listar = async (req: Request, res: Response): Promise<void> => {
        try {
            const activos = req.query.activos === 'true';
            const data = await this.service.listarPlanes(activos);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data = await this.service.obtenerPlanPorId(id);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    };

    actualizar = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (Object.keys(req.body).length === 0) {
                res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
                return;
            }
            const data = await this.service.actualizarPlan(id, req.body);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    };

    eliminar = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const fisico = req.query.fisico === 'true';
            const result = await this.service.eliminarPlan(id, fisico);
            res.status(200).json({ eliminado: result });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    calcularCuota = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { monto, plazo } = req.body;
            if (monto === undefined || plazo === undefined) {
                res.status(400).json({ error: 'Debe proporcionar monto y plazo' });
                return;
            }
            const cuota = await this.service.calcularCuota(id, monto, plazo);
            res.status(200).json({ data: { cuota, monto, plazo } });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
