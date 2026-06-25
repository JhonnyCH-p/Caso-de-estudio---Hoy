import { PlanFinanciamiento } from '../entities/PlanFinanciamiento.js';

export interface IPlanFinanciamientoRepository {
  save(plan: PlanFinanciamiento): Promise<void>;
  findById(id: string): Promise<PlanFinanciamiento | null>;
  findAll(): Promise<PlanFinanciamiento[]>;
  findActivos(): Promise<PlanFinanciamiento[]>;
  findByTasaMaxima(tasaMaxima: number): Promise<PlanFinanciamiento[]>;
  update(plan: PlanFinanciamiento): Promise<void>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  existsById(id: string): Promise<boolean>;
}