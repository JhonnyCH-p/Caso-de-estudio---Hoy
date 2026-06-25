
import { Asesor } from '../entities/Asesor.js';

export interface IAsesorRepository {
  save(asesor: Asesor): Promise<void>;
  findById(id: string): Promise<Asesor | null>;
  findAll(): Promise<Asesor[]>;
  update(asesor: Asesor): Promise<void>;
  delete(id: string): Promise<boolean>;

  findByEspecialidad(especialidad: string): Promise<Asesor[]>;
  findByExperienciaMinima(anios: number): Promise<Asesor[]>;

  count(): Promise<number>;
  existsById(id: string): Promise<boolean>;
}