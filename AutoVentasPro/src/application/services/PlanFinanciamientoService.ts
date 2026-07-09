import type { PlanFinanciamientoRepository } from '../../domain/repositories/IPlanFinanciamientoRepository.js';
import { PlanFinanciamiento } from '../../domain/entities/PlanFinanciamiento.js';
import type { CrearPlanFinanciamientoRequest, ActualizarPlanFinanciamientoRequest } from '../dtos/requests/PlanFinanciamientoRequest.js';
import type { PlanFinanciamientoResponse } from '../dtos/responses/PlanFinanciamientoResponse.js';

export class PlanFinanciamientoService {
    constructor(private repository: PlanFinanciamientoRepository) {}

    async crearPlan(request: CrearPlanFinanciamientoRequest): Promise<PlanFinanciamientoResponse> {
        this.validarCrear(request);
        const plan = PlanFinanciamiento.crear(
            request.nombre,
            request.entradaMinima,
            request.tasaInteresAnual,
            request.plazosDisponibles,
            request.comision,
        );
        await this.repository.save(plan);
        return this.toResponse(plan);
    }

    async listarPlanes(activos?: boolean): Promise<PlanFinanciamientoResponse[]> {
        const planes = activos
            ? await this.repository.findActivos()
            : await this.repository.findAll();
        return planes.map(p => this.toResponse(p));
    }

    async obtenerPlanPorId(id: string): Promise<PlanFinanciamientoResponse> {
        const plan = await this.repository.findById(id);
        if (!plan) throw new Error(`Plan con ID ${id} no encontrado`);
        return this.toResponse(plan);
    }

    async actualizarPlan(id: string, request: ActualizarPlanFinanciamientoRequest): Promise<PlanFinanciamientoResponse> {
        const plan = await this.repository.findById(id);
        if (!plan) throw new Error(`Plan con ID ${id} no encontrado`);

        if (request.nombre !== undefined) plan.setNombre(request.nombre);
        if (request.entradaMinima !== undefined) plan.setEntradaMinima(request.entradaMinima);
        if (request.tasaInteresAnual !== undefined) plan.setTasaInteresAnual(request.tasaInteresAnual);
        if (request.plazosDisponibles !== undefined) plan.setPlazosDisponibles(request.plazosDisponibles);
        if (request.comision !== undefined) plan.setComision(request.comision);
        if (request.activo !== undefined) {
            request.activo ? plan.activar() : plan.desactivar();
        }

        await this.repository.update(plan);
        return this.toResponse(plan);
    }

    async eliminarPlan(id: string, fisico: boolean = false): Promise<boolean> {
        if (fisico) return this.repository.delete(id);
        const plan = await this.repository.findById(id);
        if (!plan) return false;
        plan.desactivar();
        await this.repository.update(plan);
        return true;
    }

    async calcularCuota(idPlan: string, montoFinanciado: number, plazoMeses: number): Promise<number> {
        const plan = await this.repository.findById(idPlan);
        if (!plan) throw new Error('Plan no encontrado');
        return plan.calcularCuota(montoFinanciado, plazoMeses);
    }

    private validarCrear(request: CrearPlanFinanciamientoRequest): void {
        if (!request.nombre?.trim()) throw new Error('El nombre es obligatorio');
        if (request.entradaMinima < 0 || request.entradaMinima > 100) throw new Error('La entrada mínima debe ser entre 0 y 100');
        if (request.tasaInteresAnual < 0) throw new Error('La tasa de interés no puede ser negativa');
        if (!request.plazosDisponibles?.length) throw new Error('Debe haber al menos un plazo disponible');
        if (request.plazosDisponibles.some(p => p <= 0)) throw new Error('Los plazos deben ser números positivos');
        if (request.comision !== undefined && request.comision < 0) throw new Error('La comisión no puede ser negativa');
    }

    private toResponse(plan: PlanFinanciamiento): PlanFinanciamientoResponse {
        return {
            id: plan.getId(),
            nombre: plan.getNombre(),
            entradaMinima: plan.getEntradaMinima(),
            tasaInteresAnual: plan.getTasaInteresAnual(),
            plazosDisponibles: plan.getPlazosDisponibles(),
            comision: plan.getComision(),
            activo: plan.isActivo(),
            createdAt: plan.getCreatedAt(),
            updatedAt: plan.getUpdatedAt(),
        };
    }
}
