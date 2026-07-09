export interface PlanFinanciamientoResponse {
    id: string;
    nombre: string;
    entradaMinima: number;
    tasaInteresAnual: number;
    plazosDisponibles: number[];
    comision: number;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}
