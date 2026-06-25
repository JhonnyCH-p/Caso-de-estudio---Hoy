import { PlanFinanciamiento } from '../../domain/entities/PlanFinanciamiento.js';
import { IPlanFinanciamientoRepository } from '../../domain/repositories/IPlanFinanciamientoRepository.js';
import { PlanFinanciamientoRequest } from '../dtos/requests/PlanFinanciamientoRequest.js';
import { PlanFinanciamientoResponse } from '../dtos/responses/PlanFinanciamientoResponse.js';
import { validatePlanRequest } from '../validations/planValidations.js';
import { generateId } from '../validations/idGenerator.js';

export class PlanFinanciamientoService {
  constructor(private repo: IPlanFinanciamientoRepository) {}

  async crearPlan(request: PlanFinanciamientoRequest): Promise<PlanFinanciamientoResponse> {
    validatePlanRequest(request);
    const id = generateId('PLAN');
    const plan = new PlanFinanciamiento(
      id,
      request.nombre,
      request.entradaMinima,
      request.tasaInteresAnual,
      request.plazosDisponibles,
      request.comision,
      true,
      new Date()
    );
    await this.repo.save(plan);
    return this.toResponse(plan);
  }

  async listarPlanes(activos?: boolean): Promise<PlanFinanciamientoResponse[]> {
    const planes = activos ? await this.repo.findActivos() : await this.repo.findAll();
    return planes.map(p => this.toResponse(p));
  }

  async obtenerPlanPorId(id: string): Promise<PlanFinanciamientoResponse | null> {
    const plan = await this.repo.findById(id);
    return plan ? this.toResponse(plan) : null;
  }

  async actualizarPlan(id: string, data: Partial<PlanFinanciamientoRequest>): Promise<PlanFinanciamientoResponse> {
    const plan = await this.repo.findById(id);
    if (!plan) throw new Error(`Plan con ID ${id} no encontrado`);
    if (data.nombre !== undefined) plan.nombre = data.nombre;
    if (data.entradaMinima !== undefined) plan.entradaMinima = data.entradaMinima;
    if (data.tasaInteresAnual !== undefined) plan.tasaInteresAnual = data.tasaInteresAnual;
    if (data.plazosDisponibles !== undefined) plan.plazosDisponibles = data.plazosDisponibles;
    if (data.comision !== undefined) plan.comision = data.comision;
    await this.repo.save(plan);
    return this.toResponse(plan);
  }

  async eliminarPlan(id: string, fisico: boolean = false): Promise<boolean> {
    if (fisico) return this.repo.delete(id);
    const plan = await this.repo.findById(id);
    if (!plan) return false;
    plan.desactivar();
    await this.repo.save(plan);
    return true;
  }

  async calcularCuota(idPlan: string, montoFinanciado: number, plazoMeses: number): Promise<number> {
    const plan = await this.repo.findById(idPlan);
    if (!plan) throw new Error('Plan no encontrado');
    return plan.calcularCuota(montoFinanciado, plazoMeses);
  }

  private toResponse(plan: PlanFinanciamiento): PlanFinanciamientoResponse {
    return {
      idPlan: plan.idPlan,
      nombre: plan.nombre,
      entradaMinima: plan.entradaMinima,
      tasaInteresAnual: plan.tasaInteresAnual,
      plazosDisponibles: plan.plazosDisponibles,
      comision: plan.comision,
      activo: plan.activo,
      fechaCreacion: plan.fechaCreacion
    };
  }
}