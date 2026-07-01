

import type { IAsesorRepository } from '../../domain/repositories/IAsesorRepository.js';
import { Asesor, type AsesorData } from '../../domain/entities/Asesor.js';

export class AsesorRepositoryImpl implements IAsesorRepository {
  // Detalle técnico: Map para búsqueda O(1)
  private asesores: Map<string, AsesorData> = new Map();

  async save(asesor: Asesor): Promise<void> {
    const data = asesor.toJSON();
    this.asesores.set(data.id, data);
    console.log(` Asesor guardado en memoria: ${data.id}`);
  }

  async findById(id: string): Promise<Asesor | null> {
    const data = this.asesores.get(id);
    return data ? Asesor.fromData(data) : null;
  }

  async findAll(): Promise<Asesor[]> {
    const lista: Asesor[] = [];
    for (const data of this.asesores.values()) {
      lista.push(Asesor.fromData(data));
    }
    return lista.sort(
      (a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime()
    );
  }

  async update(asesor: Asesor): Promise<void> {
    const id = asesor.getId();
    if (!this.asesores.has(id)) {
      throw new Error(`Asesor ${id} no encontrado para actualizar`);
    }
    this.asesores.set(id, asesor.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    return this.asesores.delete(id);
  }

  async findByEspecialidad(especialidad: string): Promise<Asesor[]> {
    const resultado: Asesor[] = [];
    const termino = especialidad.toLowerCase();
    for (const data of this.asesores.values()) {
      if (data.especialidad.toLowerCase().includes(termino)) {
        resultado.push(Asesor.fromData(data));
      }
    }
    return resultado;
  }

  async findByExperienciaMinima(anios: number): Promise<Asesor[]> {
    const resultado: Asesor[] = [];
    for (const data of this.asesores.values()) {
      if (data.experienciaAnios >= anios) {
        resultado.push(Asesor.fromData(data));
      }
    }
    return resultado.sort(
      (a, b) => b.getExperienciaAnios() - a.getExperienciaAnios()
    );
  }

  async count(): Promise<number> {
    return this.asesores.size;
  }

  async existsById(id: string): Promise<boolean> {
    return this.asesores.has(id);
  }

  // Utilidad para testing
  clear(): void {
    this.asesores.clear();
  }

  async seed(): Promise<void> {
    const muestras = [
      Asesor.create('Vehículos Eléctricos', 8, 50000),
      Asesor.create('Financiamiento', 3, 30000),
      Asesor.create('Vehículos de Lujo', 12, 80000),
    ];
    for (const a of muestras) await this.save(a);
  }
}