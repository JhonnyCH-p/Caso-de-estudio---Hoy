export interface FilaAmortizacion {
   cuota: number;
   capital: number;
   interes: number;
   saldo: number;
}

export interface Cotizacion {
   id: string;
   vehiculoId: string;
   planId: string;
   clienteNombre: string;
   clienteEmail: string;
   clienteTelefono: string;
   clienteCedula: string;
   clienteCiudad: string;
   precioVehiculo: number;
   entrada: number;
   montoFinanciado: number;
   plazoMeses: number;
   tasaInteresAnual: number;
   cuotaMensual: number;
   tablaAmortizacion: FilaAmortizacion[];
   totalIntereses: number;
   totalPagado: number;
   estado: string;
   createdAt: string;
   updatedAt: string;
}

export interface SimulacionResult {
   cuotaMensual: number;
   montoFinanciado: number;
   totalIntereses: number;
   totalPagado: number;
   tablaAmortizacion: FilaAmortizacion[];
}

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

export interface CambiarEstadoCotizacionRequest {
   estado: 'APROBADA' | 'RECHAZADA' | 'EXPIRADA';
}
