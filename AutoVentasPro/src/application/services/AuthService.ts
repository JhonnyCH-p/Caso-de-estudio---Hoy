import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import type { RolUsuario } from '../../domain/entities/usuario.entity.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export interface AuthUser {
   id: string;
   usuario: string;
   rol: RolUsuario;
}

export interface LoginResult {
   token: string;
   user: AuthUser;
}

export class AuthService {
   constructor(private usuarioRepository: UsuarioRepository) {}

   async login(usuario: string, password: string): Promise<LoginResult> {
      const user = await this.usuarioRepository.findByUsuario(usuario);
      if (!user) throw new Error('Credenciales inválidas');

      const valid = bcrypt.compareSync(password, user.getPasswordHash());
      if (!valid) throw new Error('Credenciales inválidas');

      if (!user.isActivo()) throw new Error('Cuenta desactivada');

      user.registrarAcceso();
      await this.usuarioRepository.update(user);

      const authUser: AuthUser = {
         id: user.getId(),
         usuario: user.getUsuario(),
         rol: user.getRol(),
      };

      const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return { token, user: authUser };
   }

   async getProfile(id: string): Promise<AuthUser> {
      const user = await this.usuarioRepository.findById(id);
      if (!user) throw new Error('Usuario no encontrado');
      return { id: user.getId(), usuario: user.getUsuario(), rol: user.getRol() };
   }

   async createUser(usuario: string, password: string, rol: RolUsuario, extras?: Record<string, unknown>): Promise<AuthUser> {
      const exists = await this.usuarioRepository.findByUsuario(usuario);
      if (exists) throw new Error(`El usuario '${usuario}' ya existe`);

      const passwordHash = bcrypt.hashSync(password, 10);
      const user = Usuario.crear(usuario, passwordHash, rol, extras as any);
      await this.usuarioRepository.save(user);

      return { id: user.getId(), usuario: user.getUsuario(), rol: user.getRol() };
   }
}
