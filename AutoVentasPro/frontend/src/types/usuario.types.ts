export interface Usuario {
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

export interface UsuarioFormState {
   usuario: string;
   password: string;
   rol: string;
   especialidad: string;
   experienciaAnios: string;
   metaMensual: string;
   areaResponsable: string;
   bonoGestion: string;
   nivelPermiso: string;
   activo: boolean;
}
