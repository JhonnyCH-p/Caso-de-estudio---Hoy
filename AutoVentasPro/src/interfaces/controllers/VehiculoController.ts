import type { Request, Response } from 'express';
import type { VehiculoService } from '../../application/services/VehiculoService.js';

export class VehiculoController {
    constructor(private service: VehiculoService) {}

    crear = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.service.crearVehiculo(req.body);
            res.status(201).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    listar = async (req: Request, res: Response): Promise<void> => {
        try {
            const disponibles = req.query.disponibles === 'true';
            const data = await this.service.listarVehiculos(disponibles);
            res.status(200).json({ count: data.length, data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const data = await this.service.obtenerVehiculoPorId(id);
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
            const data = await this.service.actualizarVehiculo(id, req.body);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    };

    eliminar = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.service.eliminarVehiculo(id);
            res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
        } catch (error: any) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    };

    ajustarStock = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { cantidad } = req.body;
            if (cantidad === undefined) {
                res.status(400).json({ error: 'Debe proporcionar una cantidad' });
                return;
            }
            const data = await this.service.ajustarStock(id, cantidad);
            res.status(200).json({ data });
        } catch (error: any) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ error: error.message });
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
