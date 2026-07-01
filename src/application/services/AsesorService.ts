import type { IAsesorRepository } from "../../domain/repositories/IAsesorRepository.js";
import { Asesor } from "../../domain/entities/Asesor.js";
import type {
  CreateAsesorRequest,
  UpdateAsesorRequest,
} from "../dtos/requests/AsesorRequest.js";
import type {
  AsesorResponse,
  ComisionResponse,
} from "../dtos/responses/AsesorResponse.js";

export class AsesorService {
  constructor(private repository: IAsesorRepository) {}

  async createAsesor(request: CreateAsesorRequest): Promise<AsesorResponse> {
    this.validateCreateRequest(request);

    const asesor = Asesor.create(
      request.especialidad,
      request.experienciaAnios,
      request.metaMensual,
    );

    await this.repository.save(asesor);
    return this.toResponse(asesor);
  }

  
  async getAsesorById(id: string): Promise<AsesorResponse> {
    const asesor = await this.repository.findById(id);
    if (!asesor) throw new Error(`Asesor con ID ${id} no encontrado`);
    return this.toResponse(asesor);
  }

  
  async getAllAsesores(): Promise<AsesorResponse[]> {
    const asesores = await this.repository.findAll();
    return asesores.map((a) => this.toResponse(a));
  }

  
  async updateAsesor(
    id: string,
    request: UpdateAsesorRequest,
  ): Promise<AsesorResponse> {
    if (
      !request.especialidad &&
      request.experienciaAnios === undefined &&
      request.metaMensual === undefined
    ) {
      throw new Error("Debe proporcionar al menos un campo para actualizar");
    }

    const asesor = await this.repository.findById(id);
    if (!asesor) throw new Error(`Asesor con ID ${id} no encontrado`);

    if (request.especialidad) asesor.changeEspecialidad(request.especialidad);
    if (request.experienciaAnios !== undefined)
      asesor.changeExperienciaAnios(request.experienciaAnios);
    if (request.metaMensual !== undefined)
      asesor.changeMetaMensual(request.metaMensual);

    await this.repository.update(asesor);
    return this.toResponse(asesor);
  }

  
  async deleteAsesor(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error(`Asesor con ID ${id} no encontrado`);
  }

  
  async calcularComision(
    id: string,
    montoVenta: number,
  ): Promise<ComisionResponse> {
    if (montoVenta < 0)
      throw new Error("El monto de la venta no puede ser negativo");

    const asesor = await this.repository.findById(id);
    if (!asesor) throw new Error(`Asesor con ID ${id} no encontrado`);

    const comision = asesor.calcularComision(montoVenta);
    return {
      asesorId: asesor.getId(),
      especialidad: asesor.getEspecialidad(),
      montoVenta,
      comision,
    };
  }

  
  async getAseforesByEspecialidad(
    especialidad: string,
  ): Promise<AsesorResponse[]> {
    if (!especialidad || especialidad.trim().length < 2) {
      throw new Error(
        "La especialidad de búsqueda debe tener al menos 2 caracteres",
      );
    }
    const asesores = await this.repository.findByEspecialidad(especialidad);
    return asesores.map((a) => this.toResponse(a));
  }

    async getAsesoresByExperiencia(
    aniosMinimos: number,
  ): Promise<AsesorResponse[]> {
    if (aniosMinimos < 0)
      throw new Error("Los años mínimos no pueden ser negativos");
    const asesores =
      await this.repository.findByExperienciaMinima(aniosMinimos);
    return asesores.map((a) => this.toResponse(a));
  }

  
  private validateCreateRequest(request: CreateAsesorRequest): void {
    if (!request.especialidad || request.especialidad.trim().length < 3) {
      throw new Error("La especialidad debe tener al menos 3 caracteres");
    }
    if (
      request.experienciaAnios === undefined ||
      request.experienciaAnios < 0
    ) {
      throw new Error(
        "Los años de experiencia son requeridos y no pueden ser negativos",
      );
    }
    if (!request.metaMensual || request.metaMensual <= 0) {
      throw new Error("La meta mensual debe ser mayor a 0");
    }
  }

  
  private toResponse(asesor: Asesor): AsesorResponse {
    return {
      id: asesor.getId(),
      especialidad: asesor.getEspecialidad(),
      experienciaAnios: asesor.getExperienciaAnios(),
      metaMensual: asesor.getMetaMensual(),
      createdAt: asesor.getCreatedAt().toISOString(),
      updatedAt: asesor.getUpdatedAt().toISOString(),
    };
  }
}
