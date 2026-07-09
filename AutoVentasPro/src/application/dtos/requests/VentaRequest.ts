export interface CrearVentaRequest {
    cotizacionId: string;
    asesorId: string;
    valorTotal: number;
}

export interface CambiarEstadoVentaRequest {
    estado: 'APROBADA' | 'RECHAZADA' | 'CANCELADA';
}
