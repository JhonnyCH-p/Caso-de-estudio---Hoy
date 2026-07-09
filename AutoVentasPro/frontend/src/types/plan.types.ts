export interface PlanFinanciamiento {
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

export interface CrearPlanRequest {
   nombre: string;
   entradaMinima: number;
   tasaInteresAnual: number;
   plazosDisponibles: number[];
   comision?: number;
}

export interface ActualizarPlanRequest {
   nombre?: string;
   entradaMinima?: number;
   tasaInteresAnual?: number;
   plazosDisponibles?: number[];
   comision?: number;
   activo?: boolean;
}

export interface PlanFormState {
   nombre: string;
   entradaMinima: string;
   tasaInteresAnual: string;
   plazosDisponibles: string;
   comision: string;
   activo: boolean;
}

export interface PlanFormErrors {
   nombre?: string;
   entradaMinima?: string;
   tasaInteresAnual?: string;
   plazosDisponibles?: string;
}

export type PlanFormMode = 'create' | 'edit';
