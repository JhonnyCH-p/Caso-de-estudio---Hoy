export interface CrearUsuarioRequest {
  usuario: string;
  password: string;
  rol: 'asesor' | 'jefe_ventas' | 'administrador';
  especialidad?: string;
  experienciaAnios?: number;
  metaMensual?: number;
  areaResponsable?: string;
  bonoGestion?: number;
  nivelPermiso?: string;
}

export interface ActualizarUsuarioRequest {
  usuario?: string;
  password?: string;
  activo?: boolean;
  especialidad?: string;
  experienciaAnios?: number;
  metaMensual?: number;
  areaResponsable?: string;
  bonoGestion?: number;
  nivelPermiso?: string;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}
