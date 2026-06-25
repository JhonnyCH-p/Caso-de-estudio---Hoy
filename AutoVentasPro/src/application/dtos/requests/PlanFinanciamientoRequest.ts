export interface PlanFinanciamientoRequest {
  nombre: string;
  entradaMinima: number;
  tasaInteresAnual: number;
  plazosDisponibles: number[];
  comision: number;
}