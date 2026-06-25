import type { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { Usuario, type DatosUsuario } from '../../domain/entities/usuario.entity';

export class UsuarioInMemoryRepository implements UsuarioRepository {
    private usuarios: Map<string, DatosUsuario> = new Map();

    async save(usuario: Usuario): Promise<void> {
        this.usuarios.set(usuario.getId(), usuario.toJSON());
    }

    async update(usuario: Usuario): Promise<void> {
        if (!this.usuarios.has(usuario.getId())) {
            throw new Error(`Usuario ${usuario.getId()} no encontrado`);
        }
        this.usuarios.set(usuario.getId(), usuario.toJSON());
    }

    async delete(id: string): Promise<boolean> {
        return this.usuarios.delete(id);
    }

    async findById(id: string): Promise<Usuario | null> {
        const data = this.usuarios.get(id);
        return data ? Usuario.desdeDatos(data) : null;
    }

    async findAll(): Promise<Usuario[]> {
        return Array.from(this.usuarios.values())
            .map(data => Usuario.desdeDatos(data));
    }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        for (const data of this.usuarios.values()) {
            if (data.usuario === usuario.toLowerCase()) {
                return Usuario.desdeDatos(data);
            }
        }
        return null;
    }

    async findByRol(rol: string): Promise<Usuario[]> {
        return Array.from(this.usuarios.values())
            .filter(data => data.rol === rol)
            .map(data => Usuario.desdeDatos(data));
    }

    async findActivos(): Promise<Usuario[]> {
        return Array.from(this.usuarios.values())
            .filter(data => data.activo)
            .map(data => Usuario.desdeDatos(data));
    }

    async count(): Promise<number> {
        return this.usuarios.size;
    }

    clear(): void {
        this.usuarios.clear();
    }

    async seed(): Promise<void> {
        const samples = [
            Usuario.crear('admin', 'admin123', 'administrador', { nivelPermiso: 'total' }),
            Usuario.crear('jventas', 'jefe123', 'jefe_ventas', { areaResponsable: 'ventas', bonoGestion: 500 }),
            Usuario.crear('carlos', 'asesor123', 'asesor', { especialidad: 'autos', experienciaAnios: 5, metaMensual: 10 }),
            Usuario.crear('maria', 'asesor123', 'asesor', { especialidad: 'camionetas', experienciaAnios: 3, metaMensual: 8 })
        ];
        for (const u of samples) await this.save(u);
    }
}