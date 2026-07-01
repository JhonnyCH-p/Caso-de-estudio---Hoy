export interface AsesorData {
  id: string;
  especialidad: string;
  experienciaAnios: number;
  metaMensual: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Asesor {
  private id: string;
  private especialidad: string;
  private experienciaAnios: number;
  private metaMensual: number;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(data: AsesorData) {
    this.id = data.id;
    this.especialidad = data.especialidad;
    this.experienciaAnios = data.experienciaAnios;
    this.metaMensual = data.metaMensual;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.validate();
  }

  static create(
    especialidad: string,
    experienciaAnios: number,
    metaMensual: number,
  ): Asesor {
    const id =
      "asesor-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    return new Asesor({
      id,
      especialidad: especialidad.trim(),
      experienciaAnios,
      metaMensual,
      createdAt: now,
      updatedAt: now,
    });
  }

  
  static fromData(data: AsesorData): Asesor {
    return new Asesor(data);
  }

  

  private validate(): void {
    if (!this.especialidad || this.especialidad.trim().length < 3) {
      throw new Error("La especialidad debe tener al menos 3 caracteres");
    }
    if (this.experienciaAnios < 0) {
      throw new Error("Los años de experiencia no pueden ser negativos");
    }
    if (this.experienciaAnios > 60) {
      throw new Error("Los años de experiencia no pueden superar 60");
    }
    if (this.metaMensual <= 0) {
      throw new Error("La meta mensual debe ser mayor a 0");
    }
  }

  
  calcularComision(venta: number): number {
    if (venta < 0) {
      throw new Error("El monto de la venta no puede ser negativo");
    }
    let porcentaje = 0.02; // 2% base
    if (this.experienciaAnios > 5) porcentaje += 0.01;
    if (venta > this.metaMensual) porcentaje += 0.005;
    return parseFloat((venta * porcentaje).toFixed(2));
  }

  
  changeEspecialidad(nuevaEspecialidad: string): void {
    if (!nuevaEspecialidad || nuevaEspecialidad.trim().length < 3) {
      throw new Error("La especialidad debe tener al menos 3 caracteres");
    }
    this.especialidad = nuevaEspecialidad.trim();
    this.updatedAt = new Date();
  }

  
  changeExperienciaAnios(anios: number): void {
    if (anios < 0)
      throw new Error("Los años de experiencia no pueden ser negativos");
    if (anios > 60)
      throw new Error("Los años de experiencia no pueden superar 60");
    this.experienciaAnios = anios;
    this.updatedAt = new Date();
  }

  
  changeMetaMensual(meta: number): void {
    if (meta <= 0) throw new Error("La meta mensual debe ser mayor a 0");
    this.metaMensual = meta;
    this.updatedAt = new Date();
  }

  

  getId(): string {
    return this.id;
  }
  getEspecialidad(): string {
    return this.especialidad;
  }
  getExperienciaAnios(): number {
    return this.experienciaAnios;
  }
  getMetaMensual(): number {
    return this.metaMensual;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  

  toJSON(): AsesorData {
    return {
      id: this.id,
      especialidad: this.especialidad,
      experienciaAnios: this.experienciaAnios,
      metaMensual: this.metaMensual,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toString(): string {
    return `Asesor[id=${this.id}, especialidad=${this.especialidad}, experiencia=${this.experienciaAnios} años, meta=$${this.metaMensual}]`;
  }
}
