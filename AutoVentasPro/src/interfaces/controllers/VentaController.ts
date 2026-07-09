import type { Request, Response } from 'express';
import type { VentaService } from '../../application/services/VentaService.js';

export class VentaController {
    constructor(private service: VentaService) {}

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.crearVenta(req.body);
            res.status(201).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    listar = async (req: Request, res: Response): Promise<void> => {
        try {
            const estado = req.query.estado as string | undefined;
            const data = await this.service.listarVentas(estado);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data = await this.service.obtenerVentaPorId(id);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    };

    cambiarEstado = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data = await this.service.cambiarEstado(id, req.body);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrada') ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    };

    eliminar = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.service.eliminarVenta(id);
            res.status(200).json({ message: 'Venta eliminada exitosamente' });
        } catch (error: any) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    };

    porAsesor = async (req: Request, res: Response): Promise<void> => {
        try {
            const { asesorId } = req.params;
            const data = await this.service.obtenerPorAsesor(asesorId);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
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
