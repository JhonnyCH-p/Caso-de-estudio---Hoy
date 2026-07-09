import type { PlanFinanciamientoRepository } from '../../domain/repositories/IPlanFinanciamientoRepository.js';
import { PlanFinanciamiento } from '../../domain/entities/PlanFinanciamiento.js';
import { getPrisma } from '../database/prisma.service.js';

export class PlanFinanciamientoSupabaseRepository implements PlanFinanciamientoRepository {
    async save(plan: PlanFinanciamiento): Promise<void> {
        const prisma = getPrisma();
        await prisma.planFinanciamiento.create({ data: plan.toJSON() });
    }

    async update(plan: PlanFinanciamiento): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.planFinanciamiento.findUnique({ where: { id: plan.getId() } });
        if (!exists) throw new Error(`Plan ${plan.getId()} no encontrado`);
        await prisma.planFinanciamiento.update({
            where: { id: plan.getId() },
            data: plan.toJSON(),
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try {
            await prisma.planFinanciamiento.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

    async findById(id: string): Promise<PlanFinanciamiento | null> {
        const prisma = getPrisma();
        const data = await prisma.planFinanciamiento.findUnique({ where: { id } });
        return data ? PlanFinanciamiento.desdeDatos(data as any) : null;
    }

    async findAll(): Promise<PlanFinanciamiento[]> {
        const prisma = getPrisma();
        const rows = await prisma.planFinanciamiento.findMany();
        return rows.map(r => PlanFinanciamiento.desdeDatos(r as any));
    }

    async findActivos(): Promise<PlanFinanciamiento[]> {
        const prisma = getPrisma();
        const rows = await prisma.planFinanciamiento.findMany({
            where: { activo: true },
        });
        return rows.map(r => PlanFinanciamiento.desdeDatos(r as any));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.planFinanciamiento.count();
    }
}
