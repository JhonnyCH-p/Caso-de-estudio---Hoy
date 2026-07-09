import type { VehiculoRepository } from '../../domain/repositories/IVehiculoRepository.js';
import { Vehiculo } from '../../domain/entities/Vehiculo.js';
import { getPrisma } from '../database/prisma.service.js';

export class VehiculoSupabaseRepository implements VehiculoRepository {
    async save(vehiculo: Vehiculo): Promise<void> {
        const prisma = getPrisma();
        await prisma.vehiculo.create({ data: vehiculo.toJSON() });
    }

    async update(vehiculo: Vehiculo): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.vehiculo.findUnique({ where: { id: vehiculo.getId() } });
        if (!exists) throw new Error(`Vehículo ${vehiculo.getId()} no encontrado`);
        await prisma.vehiculo.update({
            where: { id: vehiculo.getId() },
            data: vehiculo.toJSON(),
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try {
            await prisma.vehiculo.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

    async findById(id: string): Promise<Vehiculo | null> {
        const prisma = getPrisma();
        const data = await prisma.vehiculo.findUnique({ where: { id } });
        return data ? Vehiculo.desdeDatos(data as any) : null;
    }

    async findAll(): Promise<Vehiculo[]> {
        const prisma = getPrisma();
        const rows = await prisma.vehiculo.findMany();
        return rows.map(r => Vehiculo.desdeDatos(r as any));
    }

    async findDisponibles(): Promise<Vehiculo[]> {
        const prisma = getPrisma();
        const rows = await prisma.vehiculo.findMany({
            where: { activo: true, stock: { gt: 0 } },
        });
        return rows.map(r => Vehiculo.desdeDatos(r as any));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.vehiculo.count();
    }
}
