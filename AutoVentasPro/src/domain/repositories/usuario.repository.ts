import { Usuario } from '../entities/usuario.entity.js';

export interface UsuarioRepository {
    save(usuario: Usuario): Promise<void>;
    update(usuario: Usuario): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Usuario | null>;
    findAll(): Promise<Usuario[]>;
    findByUsuario(usuario: string): Promise<Usuario | null>;
    findByRol(rol: string): Promise<Usuario[]>;
    findActivos(): Promise<Usuario[]>;
    count(): Promise<number>;
}