import { Vehiculo } from '../entities/Vehiculo.js';

export interface VehiculoRepository {
  save(vehiculo: Vehiculo): Promise<void>;
  findByRangoPrecio(min: number, max: number): Promise<Vehiculo[]>;
  findById(id: string): Promise<Vehiculo | null>;
  findAll(): Promise<Vehiculo[]>;
  update(vehiculo: Vehiculo): Promise<void>;
  delete(id: string): Promise<boolean>;
  findByMarca(marca: string): Promise<Vehiculo[]>;
  findDisponibles(): Promise<Vehiculo[]>;
  count(): Promise<number>;
}