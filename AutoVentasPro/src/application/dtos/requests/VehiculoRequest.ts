export interface CreateVehiculoRequest {
  marca: string;
  modelo: string;
  anio: number;
  precioBase: number;
  tipo: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'DEPORTIVO';
  stock: number;
  especificaciones?: { motor?: string; transmision?: string; color?: string; combustible?: string };
}

export interface UpdateVehiculoRequest {
  marca?: string;
  modelo?: string;
  anio?: number;
  precioBase?: number;
  tipo?: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'DEPORTIVO';
  stock?: number;
  especificaciones?: { motor?: string; transmision?: string; color?: string; combustible?: string };
}