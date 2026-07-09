import { Cotizacion } from '../entities/Cotizacion.js';

export interface CotizacionRepository {
    save(cotizacion: Cotizacion): Promise<void>;
    update(cotizacion: Cotizacion): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Cotizacion | null>;
    findAll(): Promise<Cotizacion[]>;
    findActivas(): Promise<Cotizacion[]>;
    findByVehiculo(vehiculoId: string): Promise<Cotizacion[]>;
    count(): Promise<number>;
}
