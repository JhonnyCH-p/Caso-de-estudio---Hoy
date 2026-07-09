import { Venta } from '../entities/Venta.js';

export interface VentaRepository {
    save(venta: Venta): Promise<void>;
    update(venta: Venta): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Venta | null>;
    findAll(): Promise<Venta[]>;
    findByAsesor(asesorId: string): Promise<Venta[]>;
    findByEstado(estado: string): Promise<Venta[]>;
    count(): Promise<number>;
}
