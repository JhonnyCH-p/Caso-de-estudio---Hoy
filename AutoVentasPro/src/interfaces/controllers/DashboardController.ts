import type { Request, Response } from 'express';
import type { DashboardService } from '../../application/services/DashboardService.js';

export class DashboardController {
    constructor(private service: DashboardService) {}

    obtenerDashboard = async (_req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.getDashboard();
            res.status(200).json({ data });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
