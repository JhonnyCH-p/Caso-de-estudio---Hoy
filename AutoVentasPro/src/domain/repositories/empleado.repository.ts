import { Empleado } from '../entities/empleado.entity.js';

export interface EmpleadoRepository {
    save(empleado: Empleado): Promise<void>;
    update(empleado: Empleado): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Empleado | null>;
    findAll(): Promise<Empleado[]>;
    count(): Promise<number>;
}
