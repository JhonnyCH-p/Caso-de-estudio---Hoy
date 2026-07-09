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
