export interface UsuarioResponse {
  id: string;
  usuario: string;
  rol: string;
  activo: boolean;
  ultimoAcceso: string | null;
  especialidad?: string;
  experienciaAnios?: number;
  metaMensual?: number;
  areaResponsable?: string;
  bonoGestion?: number;
  nivelPermiso?: string;
  fechaCreacion: string;
}

export interface LoginResponse {
  id: string;
  usuario: string;
  rol: string;
  mensaje: string;
}

export interface ComisionUsuarioResponse {
  usuarioId: string;
  usuario: string;
  rol: string;
  montoVenta: number;
  comision: number;
}
