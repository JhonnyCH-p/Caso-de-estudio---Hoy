import type { EmpleadoRepository } from '../../domain/repositories/empleado.repository.js';
import { Empleado } from '../../domain/entities/empleado.entity.js';
import { getPrisma } from '../database/prisma.service.js';

export class EmpleadoSupabaseRepository implements EmpleadoRepository {
    async save(empleado: Empleado): Promise<void> {
        const prisma = getPrisma();
        await prisma.empleado.create({ data: empleado.toJSON() });
    }

    async update(empleado: Empleado): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.empleado.findUnique({ where: { id: empleado.getId() } });
        if (!exists) throw new Error(`Empleado ${empleado.getId()} no encontrado`);
        await prisma.empleado.update({
            where: { id: empleado.getId() },
            data: empleado.toJSON(),
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try {
            await prisma.empleado.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

    async findById(id: string): Promise<Empleado | null> {
        const prisma = getPrisma();
        const data = await prisma.empleado.findUnique({ where: { id } });
        return data ? Empleado.desdeDatos(data) : null;
    }

    async findAll(): Promise<Empleado[]> {
        const prisma = getPrisma();
        const rows = await prisma.empleado.findMany();
        return rows.map(r => Empleado.desdeDatos(r));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.empleado.count();
    }
}
