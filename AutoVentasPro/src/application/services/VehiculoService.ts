import { VehiculoRepository } from '../../domain/repositories/IVehiculoRepository.js';
import { Vehiculo } from '../../domain/entities/Vehiculo.js';
import { CreateVehiculoRequest, UpdateVehiculoRequest } from '../dtos/requests/VehiculoRequest.js';
import {VehiculoResponse } from '../dtos/responses/VehiculoResponse.js';


export class VehiculoService {
  constructor(private repository: VehiculoRepository) {}

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
      disponible: vehiculo.estaDisponible(),
      createdAt: vehiculo.getCreatedAt().toISOString(),
      updatedAt: vehiculo.getUpdatedAt().toISOString(),
    };
  }

  //Validaciones de aplicación
  private validateCreateRequest(req: CreateVehiculoRequest): void {
    if (!req.marca || req.marca.trim().length < 2) {
      throw new Error('La marca debe tener al menos 2 caracteres');
    }
    if (!req.modelo || req.modelo.trim().length < 2) {
      throw new Error('El modelo debe tener al menos 2 caracteres');
    }
    if (!req.anio || req.anio < 1900 || req.anio > new Date().getFullYear() + 1) {
      throw new Error('Año inválido (debe estar entre 1900 y el año siguiente)');
    }
    if (req.precioBase < 0) {
      throw new Error('El precio base no puede ser negativo');
    }
    if (req.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    const tipos = ['SEDAN', 'SUV', 'HATCHBACK', 'PICKUP', 'DEPORTIVO'];
    if (!tipos.includes(req.tipo)) {
      throw new Error('Tipo de vehículo inválido');
    }
  }

  private validateUpdateRequest(req: UpdateVehiculoRequest): void {
    if (req.marca !== undefined && req.marca.trim().length < 2) {
      throw new Error('La marca debe tener al menos 2 caracteres');
    }
    if (req.modelo !== undefined && req.modelo.trim().length < 2) {
      throw new Error('El modelo debe tener al menos 2 caracteres');
    }
    if (req.anio !== undefined && (req.anio < 1900 || req.anio > new Date().getFullYear() + 1)) {
      throw new Error('Año inválido');
    }
    if (req.precioBase !== undefined && req.precioBase < 0) {
      throw new Error('El precio base no puede ser negativo');
    }
    if (req.stock !== undefined && req.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
  }

  async create(req: CreateVehiculoRequest): Promise<VehiculoResponse> {
    this.validateCreateRequest(req);
    const vehiculo = Vehiculo.create(req.marca, req.modelo, req.anio, req.precioBase, req.tipo, req.stock, req.especificaciones);
    await this.repository.save(vehiculo);
    return this.toResponse(vehiculo);
  }

  async getById(id: string): Promise<VehiculoResponse> {
    const vehiculo = await this.repository.findById(id);
    if (!vehiculo) throw new Error('Vehículo no encontrado');
    return this.toResponse(vehiculo);
  }

  async getAll(): Promise<VehiculoResponse[]> {
    const vehiculos = await this.repository.findAll();
    return vehiculos.map(v => this.toResponse(v));
  }

  async update(id: string, req: UpdateVehiculoRequest): Promise<VehiculoResponse> {
    this.validateUpdateRequest(req);
    const vehiculo = await this.repository.findById(id);
    if (!vehiculo) throw new Error('Vehículo no encontrado');
    vehiculo.actualizar(req);
    await this.repository.update(vehiculo);
    return this.toResponse(vehiculo);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error('Vehículo no encontrado');
  }

  async getVehiculosByRangoPrecio(min: number, max: number): Promise<VehiculoResponse[]> {
    if (min < 0 || max < 0 || min > max) {
      throw new Error('Rango de precio inválido');
    }
    const vehiculos = await this.repository.findByRangoPrecio(min, max);
    return vehiculos.map(v => this.toResponse(v));
  }

  async ajustarStock(id: string, cantidad: number): Promise<VehiculoResponse> {
    const vehiculo = await this.repository.findById(id);
    if (!vehiculo) throw new Error('Vehículo no encontrado');
    vehiculo.ajustarStock(cantidad);
    await this.repository.update(vehiculo);
    return this.toResponse(vehiculo);
  }

  async getDisponibles(): Promise<VehiculoResponse[]> {
    const vehiculos = await this.repository.findDisponibles();
    return vehiculos.map(v => this.toResponse(v));
  }
}