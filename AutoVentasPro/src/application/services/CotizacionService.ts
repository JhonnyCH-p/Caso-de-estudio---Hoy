import type { CotizacionRepository } from '../../domain/repositories/ICotizacionRepository.js';
import type { VehiculoRepository } from '../../domain/repositories/IVehiculoRepository.js';
import type { PlanFinanciamientoRepository } from '../../domain/repositories/IPlanFinanciamientoRepository.js';
import { Cotizacion } from '../../domain/entities/Cotizacion.js';
import { ClienteInfo } from '../../domain/value-objects/ClienteInfo.js';
import { TablaAmortizacion } from '../../domain/value-objects/TablaAmortizacion.js';
import type { CrearCotizacionRequest, SimularCotizacionRequest, CambiarEstadoCotizacionRequest } from '../dtos/requests/CotizacionRequest.js';
import type { CotizacionResponse, SimulacionResponse, FilaAmortizacionDTO } from '../dtos/responses/CotizacionResponse.js';

export class CotizacionService {
    constructor(
        private cotizacionRepo: CotizacionRepository,
        private vehiculoRepo: VehiculoRepository,
        private planRepo: PlanFinanciamientoRepository,
    ) {}

    async simularCotizacion(request: SimularCotizacionRequest): Promise<SimulacionResponse> {
        const vehiculo = await this.vehiculoRepo.findById(request.vehiculoId);
        if (!vehiculo) throw new Error('Vehiculo no encontrado');
        if (!vehiculo.estaDisponible()) throw new Error('Vehiculo no disponible');

        const plan = await this.planRepo.findById(request.planId);
        if (!plan) throw new Error('Plan financiero no encontrado');

        const plazos = plan.getPlazosDisponibles();
        if (!plazos.includes(request.plazoMeses)) {
            throw new Error('Plazo ' + request.plazoMeses + ' no disponible en este plan');
        }

        const precioVehiculo = vehiculo.getPrecioBase();
        const entrada = request.entrada;
        if (entrada < (precioVehiculo * plan.getEntradaMinima() / 100)) {
            throw new Error('La entrada minima es ' + plan.getEntradaMinima() + '% ($' + (precioVehiculo * plan.getEntradaMinima() / 100).toFixed(2) + ')');
        }

        const montoFinanciado = precioVehiculo - entrada;
        const cuotaMensual = plan.calcularCuota(montoFinanciado, request.plazoMeses);
        const tabla = TablaAmortizacion.generar(montoFinanciado, plan.getTasaInteresAnual(), request.plazoMeses, cuotaMensual);

        return {
            cuotaMensual,
            montoFinanciado,
            totalIntereses: tabla.getTotalIntereses(),
            totalPagado: tabla.getTotalPagado(),
            tablaAmortizacion: tabla.getFilas() as FilaAmortizacionDTO[],
        };
    }

    async crearCotizacion(request: CrearCotizacionRequest): Promise<CotizacionResponse> {
        const vehiculo = await this.vehiculoRepo.findById(request.vehiculoId);
        if (!vehiculo) throw new Error('Vehiculo no encontrado');
        if (!vehiculo.estaDisponible()) throw new Error('Vehiculo no disponible');

        const plan = await this.planRepo.findById(request.planId);
        if (!plan) throw new Error('Plan financiero no encontrado');

        const plazos = plan.getPlazosDisponibles();
        if (!plazos.includes(request.plazoMeses)) {
            throw new Error('Plazo ' + request.plazoMeses + ' no disponible en este plan');
        }

        const precioVehiculo = vehiculo.getPrecioBase();
        const entrada = request.entrada;
        if (entrada < (precioVehiculo * plan.getEntradaMinima() / 100)) {
            throw new Error('La entrada minima es ' + plan.getEntradaMinima() + '% ($' + (precioVehiculo * plan.getEntradaMinima() / 100).toFixed(2) + ')');
        }

        const montoFinanciado = precioVehiculo - entrada;
        const cuotaMensual = plan.calcularCuota(montoFinanciado, request.plazoMeses);
        const tabla = TablaAmortizacion.generar(montoFinanciado, plan.getTasaInteresAnual(), request.plazoMeses, cuotaMensual);

        const cliente = new ClienteInfo({
            nombre: request.clienteNombre,
            email: request.clienteEmail,
            telefono: request.clienteTelefono,
            cedula: request.clienteCedula,
            ciudad: request.clienteCiudad,
        });

        const cotizacion = Cotizacion.crear(
            request.vehiculoId,
            request.planId,
            cliente,
            precioVehiculo,
            entrada,
            request.plazoMeses,
            plan.getTasaInteresAnual(),
            cuotaMensual,
            tabla,
        );

        await this.cotizacionRepo.save(cotizacion);
        return this.toResponse(cotizacion, tabla);
    }

    async listarCotizaciones(activas?: boolean): Promise<CotizacionResponse[]> {
        const cotizaciones = activas
            ? await this.cotizacionRepo.findActivas()
            : await this.cotizacionRepo.findAll();
        return cotizaciones.map(c => this.toResponse(c));
    }

    async obtenerCotizacionPorId(id: string): Promise<CotizacionResponse> {
        const cotizacion = await this.cotizacionRepo.findById(id);
        if (!cotizacion) throw new Error('Cotizacion con ID ' + id + ' no encontrada');
        return this.toResponse(cotizacion);
    }

    async cambiarEstado(id: string, request: CambiarEstadoCotizacionRequest): Promise<CotizacionResponse> {
        const cotizacion = await this.cotizacionRepo.findById(id);
        if (!cotizacion) throw new Error('Cotizacion con ID ' + id + ' no encontrada');

        switch (request.estado) {
            case 'APROBADA': cotizacion.aprobar(); break;
            case 'RECHAZADA': cotizacion.rechazar(); break;
            case 'EXPIRADA': cotizacion.expirar(); break;
        }

        await this.cotizacionRepo.update(cotizacion);
        return this.toResponse(cotizacion);
    }

    async eliminarCotizacion(id: string): Promise<void> {
        const deleted = await this.cotizacionRepo.delete(id);
        if (!deleted) throw new Error('Cotizacion con ID ' + id + ' no encontrada');
    }

    private toResponse(cotizacion?: Cotizacion, tabla?: TablaAmortizacion): CotizacionResponse {
        if (!cotizacion) throw new Error('Cotizacion invalida');
        const t = tabla ?? cotizacion.getTabla();
        return {
            id: cotizacion.getId(),
            vehiculoId: cotizacion.getVehiculoId(),
            planId: cotizacion.getPlanId(),
            clienteNombre: cotizacion.getCliente().getNombre(),
            clienteEmail: cotizacion.getCliente().getEmail(),
            clienteTelefono: cotizacion.getCliente().getTelefono(),
            clienteCedula: cotizacion.getCliente().getCedula(),
            clienteCiudad: cotizacion.getCliente().getCiudad(),
            precioVehiculo: cotizacion.getPrecioVehiculo(),
            entrada: cotizacion.getEntrada(),
            montoFinanciado: cotizacion.getMontoFinanciado(),
            plazoMeses: cotizacion.getPlazoMeses(),
            tasaInteresAnual: cotizacion.getTasaInteresAnual(),
            cuotaMensual: cotizacion.getCuotaMensual(),
            tablaAmortizacion: t.getFilas() as FilaAmortizacionDTO[],
            totalIntereses: t.getTotalIntereses(),
            totalPagado: t.getTotalPagado(),
            estado: cotizacion.getEstado(),
            createdAt: cotizacion.getCreatedAt(),
            updatedAt: cotizacion.getUpdatedAt(),
        };
    }
}
