import type { VentaRepository } from '../../domain/repositories/IVentaRepository.js';
import type { CotizacionRepository } from '../../domain/repositories/ICotizacionRepository.js';
import { Venta } from '../../domain/entities/Venta.js';
import type { CrearVentaRequest, CambiarEstadoVentaRequest } from '../dtos/requests/VentaRequest.js';
import type { VentaResponse } from '../dtos/responses/VentaResponse.js';

export class VentaService {
    constructor(
        private ventaRepo: VentaRepository,
        private cotizacionRepo: CotizacionRepository,
    ) {}

    async crearVenta(request: CrearVentaRequest): Promise<VentaResponse> {
        const cotizacion = await this.cotizacionRepo.findById(request.cotizacionId);
        if (!cotizacion) throw new Error('Cotización no encontrada');
        if (!cotizacion.estaAprobada()) throw new Error('La cotización debe estar aprobada para generar una venta');

        const venta = Venta.crear(request.cotizacionId, request.asesorId, request.valorTotal);
        await this.ventaRepo.save(venta);
        return this.toResponse(venta);
    }

    async listarVentas(estado?: string): Promise<VentaResponse[]> {
        const ventas = estado
            ? await this.ventaRepo.findByEstado(estado)
            : await this.ventaRepo.findAll();
        return ventas.map(v => this.toResponse(v));
    }

    async obtenerVentaPorId(id: string): Promise<VentaResponse> {
        const venta = await this.ventaRepo.findById(id);
        if (!venta) throw new Error(`Venta con ID ${id} no encontrada`);
        return this.toResponse(venta);
    }

    async cambiarEstado(id: string, request: CambiarEstadoVentaRequest): Promise<VentaResponse> {
        const venta = await this.ventaRepo.findById(id);
        if (!venta) throw new Error(`Venta con ID ${id} no encontrada`);

        switch (request.estado) {
            case 'APROBADA': venta.aprobar(); break;
            case 'RECHAZADA': venta.rechazar(); break;
            case 'CANCELADA': venta.cancelar(); break;
        }

        await this.ventaRepo.update(venta);
        return this.toResponse(venta);
    }

    async eliminarVenta(id: string): Promise<void> {
        const deleted = await this.ventaRepo.delete(id);
        if (!deleted) throw new Error(`Venta con ID ${id} no encontrada`);
    }

    async obtenerPorAsesor(asesorId: string): Promise<VentaResponse[]> {
        const ventas = await this.ventaRepo.findByAsesor(asesorId);
        return ventas.map(v => this.toResponse(v));
    }

    async obtenerEstadisticas(): Promise<{ total: number; aprobadas: number; pendientes: number; rechazadas: number; canceladas: number; montoTotal: number }> {
        const ventas = await this.ventaRepo.findAll();
        return {
            total: ventas.length,
            aprobadas: ventas.filter(v => v.estaAprobada()).length,
            pendientes: ventas.filter(v => v.estaPendiente()).length,
            rechazadas: ventas.filter(v => v.getEstado() === 'RECHAZADA').length,
            canceladas: ventas.filter(v => v.getEstado() === 'CANCELADA').length,
            montoTotal: ventas.reduce((sum, v) => sum + v.getValorTotal(), 0),
        };
    }

    private toResponse(venta: Venta): VentaResponse {
        return {
            id: venta.getId(),
            cotizacionId: venta.getCotizacionId(),
            asesorId: venta.getAsesorId(),
            valorTotal: venta.getValorTotal(),
            estado: venta.getEstado(),
            createdAt: venta.getCreatedAt(),
            updatedAt: venta.getUpdatedAt(),
        };
    }
}
