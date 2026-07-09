import type { CotizacionRepository } from '../../domain/repositories/ICotizacionRepository.js';
import { Cotizacion } from '../../domain/entities/Cotizacion.js';
import { getPrisma } from '../database/prisma.service.js';

export class CotizacionSupabaseRepository implements CotizacionRepository {
    async save(cotizacion: Cotizacion): Promise<void> {
        const prisma = getPrisma();
        await prisma.cotizacion.create({ data: cotizacion.toJSON() });
    }

    async update(cotizacion: Cotizacion): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.cotizacion.findUnique({ where: { id: cotizacion.getId() } });
        if (!exists) throw new Error(`Cotización ${cotizacion.getId()} no encontrada`);
        await prisma.cotizacion.update({
            where: { id: cotizacion.getId() },
            data: cotizacion.toJSON(),
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try { await prisma.cotizacion.delete({ where: { id } }); return true; }
        catch { return false; }
    }

    async findById(id: string): Promise<Cotizacion | null> {
        const prisma = getPrisma();
        const data = await prisma.cotizacion.findUnique({ where: { id } });
        return data ? Cotizacion.desdeDatos(data as any) : null;
    }

    async findAll(): Promise<Cotizacion[]> {
        const prisma = getPrisma();
        const rows = await prisma.cotizacion.findMany();
        return rows.map(r => Cotizacion.desdeDatos(r as any));
    }

    async findActivas(): Promise<Cotizacion[]> {
        const prisma = getPrisma();
        const rows = await prisma.cotizacion.findMany({
            where: { estado: { in: ['PENDIENTE', 'APROBADA'] } },
        });
        return rows.map(r => Cotizacion.desdeDatos(r as any));
    }

    async findByVehiculo(vehiculoId: string): Promise<Cotizacion[]> {
        const prisma = getPrisma();
        const rows = await prisma.cotizacion.findMany({ where: { vehiculoId } });
        return rows.map(r => Cotizacion.desdeDatos(r as any));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.cotizacion.count();
    }
}
