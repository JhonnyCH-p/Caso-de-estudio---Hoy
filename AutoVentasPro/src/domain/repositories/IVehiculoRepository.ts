import { Vehiculo } from '../entities/Vehiculo.js';

export interface VehiculoRepository {
    save(vehiculo: Vehiculo): Promise<void>;
    update(vehiculo: Vehiculo): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Vehiculo | null>;
    findAll(): Promise<Vehiculo[]>;
    findDisponibles(): Promise<Vehiculo[]>;
    count(): Promise<number>;
}
