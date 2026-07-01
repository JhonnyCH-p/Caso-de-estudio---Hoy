export interface CreateAsesorRequest {
  especialidad: string;
  experienciaAnios: number;
  metaMensual: number;
}

export interface UpdateAsesorRequest {
  especialidad?: string;
  experienciaAnios?: number;
  metaMensual?: number;
}