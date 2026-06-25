export interface PlanFinanciamientoResponse {
  idPlan: string;
  nombre: string;
  entradaMinima: number;
  tasaInteresAnual: number;
  plazosDisponibles: number[];
  comision: number;
  activo: boolean;
  fechaCreacion: Date;
}