import type { VehiculoRepository } from '../../domain/repositories/IVehiculoRepository.js';
import { Vehiculo } from '../../domain/entities/Vehiculo.js';
import type { CrearVehiculoRequest, ActualizarVehiculoRequest } from '../dtos/requests/VehiculoRequest.js';
import type { VehiculoResponse } from '../dtos/responses/VehiculoResponse.js';

export class VehiculoService {
    constructor(private repository: VehiculoRepository) {}

    async crearVehiculo(request: CrearVehiculoRequest): Promise<VehiculoResponse> {
        this.validarCrear(request);
        const vehiculo = Vehiculo.crear(
            request.marca,
            request.modelo,
            request.anio,
            request.precioBase,
            request.tipo,
            request.stock,
            request.especificaciones,
            request.imagen,
        );
        await this.repository.save(vehiculo);
        return this.toResponse(vehiculo);
    }

    async listarVehiculos(disponibles?: boolean): Promise<VehiculoResponse[]> {
        const vehiculos = disponibles
            ? await this.repository.findDisponibles()
            : await this.repository.findAll();
        return vehiculos.map(v => this.toResponse(v));
    }

    async obtenerVehiculoPorId(id: string): Promise<VehiculoResponse> {
        const vehiculo = await this.repository.findById(id);
        if (!vehiculo) throw new Error(`Vehículo con ID ${id} no encontrado`);
        return this.toResponse(vehiculo);
    }

    async actualizarVehiculo(id: string, request: ActualizarVehiculoRequest): Promise<VehiculoResponse> {
        const vehiculo = await this.repository.findById(id);
        if (!vehiculo) throw new Error(`Vehículo con ID ${id} no encontrado`);

        if (request.marca !== undefined) vehiculo.setMarca(request.marca);
        if (request.modelo !== undefined) vehiculo.setModelo(request.modelo);
        if (request.anio !== undefined) vehiculo.setAnio(request.anio);
        if (request.precioBase !== undefined) vehiculo.setPrecioBase(request.precioBase);
        if (request.tipo !== undefined) vehiculo.setTipo(request.tipo);
        if (request.stock !== undefined) {
            const diff = request.stock - vehiculo.getStock();
            vehiculo.ajustarStock(diff);
        }
        if (request.especificaciones !== undefined) vehiculo.setEspecificaciones(request.especificaciones);
        if (request.imagen !== undefined) vehiculo.setImagen(request.imagen);
        if (request.activo !== undefined) {
            request.activo ? vehiculo.activar() : vehiculo.desactivar();
        }

        await this.repository.update(vehiculo);
        return this.toResponse(vehiculo);
    }

    async eliminarVehiculo(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) throw new Error(`Vehículo con ID ${id} no encontrado`);
    }

    async ajustarStock(id: string, cantidad: number): Promise<VehiculoResponse> {
        const vehiculo = await this.repository.findById(id);
        if (!vehiculo) throw new Error(`Vehículo con ID ${id} no encontrado`);
        vehiculo.ajustarStock(cantidad);
        await this.repository.update(vehiculo);
        return this.toResponse(vehiculo);
    }

    async obtenerEstadisticas(): Promise<{ total: number; disponible: number; precioPromedio: number; precioMax: number; precioMin: number }> {
        const vehiculos = await this.repository.findAll();
        const disponibles = vehiculos.filter(v => v.estaDisponible());
        const precios = vehiculos.map(v => v.getPrecioBase());
        return {
            total: vehiculos.length,
            disponible: disponibles.length,
            precioPromedio: precios.length > 0 ? precios.reduce((a, b) => a + b, 0) / precios.length : 0,
            precioMax: precios.length > 0 ? Math.max(...precios) : 0,
            precioMin: precios.length > 0 ? Math.min(...precios) : 0,
        };
    }

    private validarCrear(request: CrearVehiculoRequest): void {
        if (!request.marca || request.marca.trim().length < 2) throw new Error('La marca debe tener al menos 2 caracteres');
        if (!request.modelo || request.modelo.trim().length < 2) throw new Error('El modelo debe tener al menos 2 caracteres');
        if (!request.anio || request.anio < 1900 || request.anio > new Date().getFullYear() + 1) throw new Error('Año inválido');
        if (request.precioBase < 0) throw new Error('El precio base no puede ser negativo');
        if (request.stock !== undefined && request.stock < 0) throw new Error('El stock no puede ser negativo');
        const tipos = ['SEDAN', 'SUV', 'HATCHBACK', 'PICKUP', 'DEPORTIVO'];
        if (!tipos.includes(request.tipo)) throw new Error('Tipo de vehículo inválido');
    }

    private toResponse(vehiculo: Vehiculo): VehiculoResponse {
        return {
            id: vehiculo.getId(),
            marca: vehiculo.getMarca(),
            modelo: vehiculo.getModelo(),
            anio: vehiculo.getAnio(),
            precioBase: vehiculo.getPrecioBase(),
            tipo: vehiculo.getTipo(),
            stock: vehiculo.getStock(),
            especificaciones: vehiculo.getEspecificaciones(),
            imagen: vehiculo.getImagen(),
            activo: vehiculo.isActivo(),
            disponible: vehiculo.estaDisponible(),
            createdAt: vehiculo.getCreatedAt(),
            updatedAt: vehiculo.getUpdatedAt(),
        };
    }
}
