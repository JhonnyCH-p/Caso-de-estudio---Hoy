import bcrypt from 'bcryptjs';
import type { UsuarioRepository } from '../../domain/repositories/usuario.repository.js';
import { Usuario, type RolUsuario } from '../../domain/entities/usuario.entity.js';
import type { CrearUsuarioRequest, ActualizarUsuarioRequest } from '../dtos/requests/UsuarioRequest.js';
import type { UsuarioResponse, LoginResponse, ComisionUsuarioResponse } from '../dtos/responses/UsuarioResponse.js';

export class UsuarioService {
  constructor(private repository: UsuarioRepository) {}

  async crearUsuario(request: CrearUsuarioRequest): Promise<UsuarioResponse> {
    this.validarCrear(request);

    const existe = await this.repository.findByUsuario(request.usuario);
    if (existe) {
      throw new Error(`El usuario '${request.usuario}' ya existe`);
    }

    const passwordHash = bcrypt.hashSync(request.password, 10);
    const usuario = Usuario.crear(
      request.usuario,
      passwordHash,
      request.rol as RolUsuario,
      {
        especialidad: request.especialidad,
        experienciaAnios: request.experienciaAnios,
        metaMensual: request.metaMensual,
        areaResponsable: request.areaResponsable,
        bonoGestion: request.bonoGestion,
        nivelPermiso: request.nivelPermiso,
      }
    );

    await this.repository.save(usuario);
    return this.toResponse(usuario);
  }

  async listarUsuarios(activos?: boolean): Promise<UsuarioResponse[]> {
    const usuarios = activos ? await this.repository.findActivos() : await this.repository.findAll();
    return usuarios.map(u => this.toResponse(u));
  }

  async obtenerUsuarioPorId(id: string): Promise<UsuarioResponse> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new Error(`Usuario con ID ${id} no encontrado`);
    return this.toResponse(usuario);
  }

  async actualizarUsuario(id: string, request: ActualizarUsuarioRequest): Promise<UsuarioResponse> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new Error(`Usuario con ID ${id} no encontrado`);

    const data = usuario.toJSON();

    if (request.usuario !== undefined) {
      const existe = await this.repository.findByUsuario(request.usuario);
      if (existe && existe.getId() !== id) {
        throw new Error(`El usuario '${request.usuario}' ya está en uso`);
      }
      data.usuario = request.usuario.trim().toLowerCase();
    }

    if (request.especialidad !== undefined) data.especialidad = request.especialidad;
    if (request.experienciaAnios !== undefined) data.experienciaAnios = request.experienciaAnios;
    if (request.metaMensual !== undefined) data.metaMensual = request.metaMensual;
    if (request.areaResponsable !== undefined) data.areaResponsable = request.areaResponsable;
    if (request.bonoGestion !== undefined) data.bonoGestion = request.bonoGestion;
    if (request.nivelPermiso !== undefined) data.nivelPermiso = request.nivelPermiso;
    if (request.activo !== undefined) data.activo = request.activo;
    if (request.password !== undefined) {
      data.passwordHash = bcrypt.hashSync(request.password, 10);
    }

    const actualizado = Usuario.desdeDatos(data);
    await this.repository.update(actualizado);
    return this.toResponse(actualizado);
  }

  async eliminarUsuario(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error(`Usuario con ID ${id} no encontrado`);
  }

  async login(request: { usuario: string; password: string }): Promise<LoginResponse> {
    const usuario = await this.repository.findByUsuario(request.usuario);
    if (!usuario) throw new Error('Credenciales inválidas');

    if (!bcrypt.compareSync(request.password, usuario.getPasswordHash())) {
      throw new Error('Credenciales inválidas');
    }

    if (!usuario.isActivo()) {
      throw new Error('La cuenta está desactivada');
    }

    usuario.registrarAcceso();
    await this.repository.update(usuario);

    return {
      id: usuario.getId(),
      usuario: usuario.getUsuario(),
      rol: usuario.getRol(),
      mensaje: `Inicio de sesión exitoso como ${usuario.getRol()}`,
    };
  }

  async buscarPorRol(rol: string): Promise<UsuarioResponse[]> {
    const rolesValidos = ['asesor', 'jefe_ventas', 'administrador'];
    if (!rolesValidos.includes(rol)) throw new Error(`Rol inválido: ${rol}`);
    const usuarios = await this.repository.findByRol(rol);
    return usuarios.map(u => this.toResponse(u));
  }

  async calcularComision(usuarioId: string, montoVenta: number): Promise<ComisionUsuarioResponse> {
    if (montoVenta < 0) throw new Error('El monto de la venta no puede ser negativo');

    const usuario = await this.repository.findById(usuarioId);
    if (!usuario) throw new Error(`Usuario con ID ${usuarioId} no encontrado`);

    const comision = usuario.calcularComision(montoVenta);
    return {
      usuarioId: usuario.getId(),
      usuario: usuario.getUsuario(),
      rol: usuario.getRol(),
      montoVenta,
      comision,
    };
  }

  async obtenerEstadisticas(): Promise<{
    total: number;
    activos: number;
    porRol: Record<string, number>;
  }> {
    const todos = await this.repository.findAll();
    const total = todos.length;
    const activos = todos.filter(u => u.isActivo()).length;
    const porRol: Record<string, number> = { asesor: 0, jefe_ventas: 0, administrador: 0 };

    for (const u of todos) {
      if (u.getRol() in porRol) porRol[u.getRol()]++;
    }

    return { total, activos, porRol };
  }

  private validarCrear(request: CrearUsuarioRequest): void {
    if (!request.usuario || request.usuario.trim().length < 4) {
      throw new Error('El usuario debe tener al menos 4 caracteres');
    }
    if (!request.password || request.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!['asesor', 'jefe_ventas', 'administrador'].includes(request.rol)) {
      throw new Error('Rol no válido');
    }
  }

  private toResponse(usuario: Usuario): UsuarioResponse {
    return {
      id: usuario.getId(),
      usuario: usuario.getUsuario(),
      rol: usuario.getRol(),
      activo: usuario.isActivo(),
      ultimoAcceso: usuario.getUltimoAcceso()?.toISOString() ?? null,
      especialidad: usuario.getEspecialidad(),
      experienciaAnios: usuario.getExperienciaAnios(),
      metaMensual: usuario.getMetaMensual(),
      areaResponsable: usuario.getAreaResponsable(),
      bonoGestion: usuario.getBonoGestion(),
      nivelPermiso: usuario.getNivelPermiso(),
      fechaCreacion: usuario.getFechaCreacion().toISOString(),
    };
  }
}
