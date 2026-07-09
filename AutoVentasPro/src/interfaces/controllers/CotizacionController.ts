import type { Request, Response } from 'express';
import type { CotizacionService } from '../../application/services/CotizacionService.js';

export class CotizacionController {
    constructor(private service: CotizacionService) {}

    simular = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.simularCotizacion(req.body);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.crearCotizacion(req.body);
            res.status(201).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    listar = async (req: Request, res: Response): Promise<void> => {
        try {
            const activas = req.query.activas === 'true';
            const data = await this.service.listarCotizaciones(activas);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data = await this.service.obtenerCotizacionPorId(id);
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
            await this.service.eliminarCotizacion(id);
            res.status(200).json({ message: 'Cotizacion eliminada exitosamente' });
        } catch (error: any) {
            const status = error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    };
}
