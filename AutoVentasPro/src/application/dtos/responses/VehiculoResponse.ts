export interface VehiculoResponse {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  precioBase: number;
  tipo: string;
  stock: number;
  especificaciones: any;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}