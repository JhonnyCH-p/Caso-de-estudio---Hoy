export interface CreateAsesorRequest {
  especialidad: string;
  experienciaAnios: number;
  metaMensual: number;
}

// 📁 src/application/dtos/requests/UpdateAsesorRequest.ts
export interface UpdateAsesorRequest {
  especialidad?: string;
  experienciaAnios?: number;
  metaMensual?: number;
}