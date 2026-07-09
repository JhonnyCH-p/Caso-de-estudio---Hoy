export interface Vehiculo {
   id: string;
   marca: string;
   modelo: string;
   anio: number;
   precioBase: number;
   tipo: string;
   stock: number;
   especificaciones: string;
   imagen: string | null;
   activo: boolean;
   disponible: boolean;
   createdAt: string;
   updatedAt: string;
}

export interface CrearVehiculoRequest {
   marca: string;
   modelo: string;
   anio: number;
   precioBase: number;
   tipo: string;
   stock?: number;
   especificaciones?: string;
   imagen?: string;
}

export interface ActualizarVehiculoRequest {
   marca?: string;
   modelo?: string;
   anio?: number;
   precioBase?: number;
   tipo?: string;
   stock?: number;
   especificaciones?: string;
   imagen?: string | null;
   activo?: boolean;
}

export interface VehiculoFormState {
   marca: string;
   modelo: string;
   anio: string;
   precioBase: string;
   tipo: string;
   stock: string;
   especificaciones: string;
   imagen: string;
   activo: boolean;
}

export interface VehiculoFormErrors {
   marca?: string;
   modelo?: string;
   anio?: string;
   precioBase?: string;
   tipo?: string;
}

export type VehiculoFormMode = 'create' | 'edit';
