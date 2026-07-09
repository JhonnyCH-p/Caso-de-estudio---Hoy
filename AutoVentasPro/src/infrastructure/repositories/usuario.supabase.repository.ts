import type { UsuarioRepository } from '../../domain/repositories/usuario.repository.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import { getPrisma } from '../database/prisma.service.js';

export class UsuarioSupabaseRepository implements UsuarioRepository {
    async save(usuario: Usuario): Promise<void> {
        const prisma = getPrisma();
        await prisma.usuario.create({ data: usuario.toJSON() as any });
    }

    async update(usuario: Usuario): Promise<void> {
        const prisma = getPrisma();
        const exists = await prisma.usuario.findUnique({ where: { id: usuario.getId() } });
        if (!exists) throw new Error(`Usuario ${usuario.getId()} no encontrado`);
        await prisma.usuario.update({
            where: { id: usuario.getId() },
            data: usuario.toJSON() as any,
        });
    }

    async delete(id: string): Promise<boolean> {
        const prisma = getPrisma();
        try {
            await prisma.usuario.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }

    async findById(id: string): Promise<Usuario | null> {
        const prisma = getPrisma();
        const data = await prisma.usuario.findUnique({ where: { id } });
        return data ? Usuario.desdeDatos(data as any) : null;
    }

    async findAll(): Promise<Usuario[]> {
        const prisma = getPrisma();
        const rows = await prisma.usuario.findMany();
        return rows.map(r => Usuario.desdeDatos(r as any));
    }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        const prisma = getPrisma();
        const data = await prisma.usuario.findUnique({ where: { usuario: usuario.toLowerCase() } });
        return data ? Usuario.desdeDatos(data as any) : null;
    }

    async findByRol(rol: string): Promise<Usuario[]> {
        const prisma = getPrisma();
        const rows = await prisma.usuario.findMany({ where: { rol } });
        return rows.map(r => Usuario.desdeDatos(r as any));
    }

    async findActivos(): Promise<Usuario[]> {
        const prisma = getPrisma();
        const rows = await prisma.usuario.findMany({ where: { activo: true } });
        return rows.map(r => Usuario.desdeDatos(r as any));
    }

    async count(): Promise<number> {
        const prisma = getPrisma();
        return await prisma.usuario.count();
    }
}
