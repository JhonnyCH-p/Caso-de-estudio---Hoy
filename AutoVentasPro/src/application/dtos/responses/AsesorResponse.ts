export interface AsesorResponse {
  id: string;
  especialidad: string;
  experienciaAnios: number;
  metaMensual: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComisionResponse {
  asesorId: string;
  especialidad: string;
  montoVenta: number;
  comision: number;
}