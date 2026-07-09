export interface CrearPlanFinanciamientoRequest {
    nombre: string;
    entradaMinima: number;
    tasaInteresAnual: number;
    plazosDisponibles: number[];
    comision?: number;
}

export interface ActualizarPlanFinanciamientoRequest {
    nombre?: string;
    entradaMinima?: number;
    tasaInteresAnual?: number;
    plazosDisponibles?: number[];
    comision?: number;
    activo?: boolean;
}
