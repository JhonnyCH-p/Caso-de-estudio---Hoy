import type { VentaRepository } from '../../domain/repositories/IVentaRepository.js';
import { Venta } from '../../domain/entities/Venta.js';
import { getPrisma } from '../database/prisma.service.js';

export class VentaSupabaseRepository implements VentaRepository {
    async save(venta: Venta): Promise<void> {
        const prisma = getPrisma();
        await prisma.venta.create({ data: venta.toJSON() });
    }

    async update(venta: Venta): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.venta.findUnique({ where: { id: venta.getId() } });
        if (!exists) throw new Error(`Venta ${venta.getId()} no encontrada`);
        await prisma.venta.update({
            where: { id: venta.getId() },
            data: venta.toJSON(),
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try { await prisma.venta.delete({ where: { id } }); return true; }
        catch { return false; }
    }

    async findById(id: string): Promise<Venta | null> {
        const prisma = getPrisma();
        const data = await prisma.venta.findUnique({ where: { id } });
        return data ? Venta.desdeDatos(data as any) : null;
    }

    async findAll(): Promise<Venta[]> {
        const prisma = getPrisma();
        const rows = await prisma.venta.findMany();
        return rows.map(r => Venta.desdeDatos(r as any));
    }

    async findByAsesor(asesorId: string): Promise<Venta[]> {
        const prisma = getPrisma();
        const rows = await prisma.venta.findMany({ where: { asesorId } });
        return rows.map(r => Venta.desdeDatos(r as any));
    }

    async findByEstado(estado: string): Promise<Venta[]> {
        const prisma = getPrisma();
        const rows = await prisma.venta.findMany({ where: { estado } });
        return rows.map(r => Venta.desdeDatos(r as any));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.venta.count();
    }
}
