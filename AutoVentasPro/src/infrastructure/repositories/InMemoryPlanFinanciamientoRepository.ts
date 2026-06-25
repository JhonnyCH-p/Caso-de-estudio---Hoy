import { PlanFinanciamiento } from '../../domain/entities/PlanFinanciamiento.js';
import { IPlanFinanciamientoRepository } from '../../domain/repositories/IPlanFinanciamientoRepository.js';

export class InMemoryPlanFinanciamientoRepository implements IPlanFinanciamientoRepository {
  private planes: PlanFinanciamiento[] = [];

  async save(plan: PlanFinanciamiento): Promise<void> {
    const index = this.planes.findIndex(p => p.idPlan === plan.idPlan);
    if (index !== -1) this.planes[index] = plan;
    else this.planes.push(plan);
  }

  async findById(id: string): Promise<PlanFinanciamiento | null> {
    return this.planes.find(p => p.idPlan === id) || null;
  }

  async findAll(): Promise<PlanFinanciamiento[]> {
    return [...this.planes];
  }

  async findActivos(): Promise<PlanFinanciamiento[]> {
    return this.planes.filter(p => p.activo);
  }

  async findByTasaMaxima(tasaMaxima: number): Promise<PlanFinanciamiento[]> {
    return this.planes.filter(p => p.tasaInteresAnual <= tasaMaxima);
  }

  async update(plan: PlanFinanciamiento): Promise<void> {
    const index = this.planes.findIndex(p => p.idPlan === plan.idPlan);
    if (index === -1) throw new Error('Plan no encontrado');
    this.planes[index] = plan;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.planes.findIndex(p => p.idPlan === id);
    if (index === -1) return false;
    this.planes.splice(index, 1);
    return true;
  }

  async count(): Promise<number> {
    return this.planes.length;
  }

  async existsById(id: string): Promise<boolean> {
    return this.planes.some(p => p.idPlan === id);
  }
}