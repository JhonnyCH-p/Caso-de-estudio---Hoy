export interface CrearCotizacionRequest {
    vehiculoId: string;
    planId: string;
    clienteNombre: string;
    clienteEmail: string;
    clienteTelefono: string;
    clienteCedula: string;
    clienteCiudad: string;
    entrada: number;
    plazoMeses: number;
}

export interface SimularCotizacionRequest {
    vehiculoId: string;
    planId: string;
    entrada: number;
    plazoMeses: number;
}

export interface CambiarEstadoCotizacionRequest {
    estado: 'APROBADA' | 'RECHAZADA' | 'EXPIRADA';
}
