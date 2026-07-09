export interface Venta {
   id: string;
   cotizacionId: string;
   asesorId: string;
   valorTotal: number;
   estado: string;
   createdAt: string;
   updatedAt: string;
}

export interface CrearVentaRequest {
   cotizacionId: string;
   asesorId: string;
   valorTotal: number;
}

export interface CambiarEstadoVentaRequest {
   estado: 'APROBADA' | 'RECHAZADA' | 'CANCELADA';
}

export interface VentaStatsResponse {
   total: number;
   averageValor: number;
   maxValor: number;
   minValor: number;
   aprobadas: number;
   pendientes: number;
}
