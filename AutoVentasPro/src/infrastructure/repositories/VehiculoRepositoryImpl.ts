import type { VehiculoRepository } from '../../domain/repositories/IVehiculoRepository.js';
import { Vehiculo, type VehiculoData } from '../../domain/entities/Vehiculo.js';

export class VehiculoInMemoryRepository implements VehiculoRepository {
  private vehiculos: Map<string, VehiculoData> = new Map();

  async save(vehiculo: Vehiculo): Promise<void> {
    this.vehiculos.set(vehiculo.getId(), vehiculo.toJSON());
    console.log(`💾 Vehículo guardado en memoria: ${vehiculo.getId()}`);
  }

  async update(vehiculo: Vehiculo): Promise<void> {
    const id = vehiculo.getId();
    if (!this.vehiculos.has(id)) {
      throw new Error(`Vehículo ${id} no encontrado`);
    }
    this.vehiculos.set(id, vehiculo.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    return this.vehiculos.delete(id);
  }

  async findById(id: string): Promise<Vehiculo | null> {
    const data = this.vehiculos.get(id);
    return data ? Vehiculo.fromData(data) : null;
  }

  async findAll(): Promise<Vehiculo[]> {
    const result: Vehiculo[] = [];
    for (const data of this.vehiculos.values()) {
      result.push(Vehiculo.fromData(data));
    }
    return result.sort((a, b) => a.getMarca().localeCompare(b.getMarca()));
  }

  async findByRangoPrecio(min: number, max: number): Promise<Vehiculo[]> {
    const all = await this.findAll();
    return all.filter(v => v.getPrecioBase() >= min && v.getPrecioBase() <= max);
  }

  async findByMarca(marca: string): Promise<Vehiculo[]> {
    const all = await this.findAll();
    return all.filter(v => v.getMarca().toLowerCase().includes(marca.toLowerCase()));
  }

  async findDisponibles(): Promise<Vehiculo[]> {
    const all = await this.findAll();
    return all.filter(v => v.estaDisponible());
  }

  async count(): Promise<number> {
    return this.vehiculos.size;
  }

  clear(): void {
    this.vehiculos.clear();
  }

  async seed(): Promise<void> {
    const samples = [
      Vehiculo.create('Toyota', 'Corolla', 2024, 25000, 'SEDAN', 5),
      Vehiculo.create('Honda', 'CR-V', 2024, 32000, 'SUV', 3),
      Vehiculo.create('Chevrolet', 'Sail', 2024, 18000, 'HATCHBACK', 8),
      Vehiculo.create('Toyota', 'Hilux', 2024, 45000, 'PICKUP', 2),
    ];
    for (const v of samples) await this.save(v);
  }
}