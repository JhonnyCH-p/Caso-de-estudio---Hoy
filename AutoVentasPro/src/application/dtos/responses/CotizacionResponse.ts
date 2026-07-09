export interface FilaAmortizacionDTO {
    cuota: number;
    capital: number;
    interes: number;
    saldo: number;
}

export interface SimulacionResponse {
    cuotaMensual: number;
    montoFinanciado: number;
    totalIntereses: number;
    totalPagado: number;
    tablaAmortizacion: FilaAmortizacionDTO[];
}

export interface CotizacionResponse {
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
    tablaAmortizacion: FilaAmortizacionDTO[];
    totalIntereses: number;
    totalPagado: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
}
