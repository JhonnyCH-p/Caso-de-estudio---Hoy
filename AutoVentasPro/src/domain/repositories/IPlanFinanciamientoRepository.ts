import { PlanFinanciamiento } from '../entities/PlanFinanciamiento.js';

export interface PlanFinanciamientoRepository {
    save(plan: PlanFinanciamiento): Promise<void>;
    update(plan: PlanFinanciamiento): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<PlanFinanciamiento | null>;
    findAll(): Promise<PlanFinanciamiento[]>;
    findActivos(): Promise<PlanFinanciamiento[]>;
    count(): Promise<number>;
}
