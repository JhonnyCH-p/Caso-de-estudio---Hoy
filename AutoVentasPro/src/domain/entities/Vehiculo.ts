export interface VehiculoData {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  precioBase: number;
  tipo: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'DEPORTIVO';
  stock: number;
  especificaciones: { motor?: string; transmision?: string; color?: string; combustible?: string };
  createdAt: Date;
  updatedAt: Date;
}

export class Vehiculo {
  private props: VehiculoData;

  private constructor(data: VehiculoData) {
    this.props = data;
    this.validate();
  }

  static create(marca: string, modelo: string, anio: number, precioBase: number, 
                tipo: VehiculoData['tipo'], stock: number, especificaciones?: any): Vehiculo {
    const id = `VEH-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();
    return new Vehiculo({
      id, marca: marca.trim(), modelo: modelo.trim(), anio, precioBase, tipo, stock,
      especificaciones: especificaciones || {},
      createdAt: now, updatedAt: now
    });
  }

  static fromData(data: VehiculoData): Vehiculo {
    return new Vehiculo(data);
  }

  private validate() {
    if (!this.props.marca || this.props.marca.length < 2) {
      throw new Error('Marca inválida');
    }
    if (!this.props.modelo || this.props.modelo.length < 2) {
      throw new Error('Modelo inválido');
    }
    if (this.props.anio < 1900 || this.props.anio > new Date().getFullYear() + 1) {
      throw new Error('Año inválido');
    }
    if (this.props.precioBase < 0) {
      throw new Error('Precio no puede ser negativo');
    }
    if (this.props.stock < 0) {
      throw new Error('Stock no puede ser negativo');
    }  
  }

  public actualizar(data: Partial<Omit<VehiculoData, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (data.marca !== undefined) this.props.marca = data.marca.trim();
    if (data.modelo !== undefined) this.props.modelo = data.modelo.trim();
    if (data.anio !== undefined) this.props.anio = data.anio;
    if (data.precioBase !== undefined) this.props.precioBase = data.precioBase;
    if (data.tipo !== undefined) this.props.tipo = data.tipo;
    if (data.stock !== undefined) this.props.stock = data.stock;
    if (data.especificaciones !== undefined) this.props.especificaciones = data.especificaciones;
    this.props.updatedAt = new Date();
    this.validate();
  }

  public ajustarStock(cantidad: number) {
    const nuevo = this.props.stock + cantidad;
    if (nuevo < 0) throw new Error('Stock insuficiente');
    this.props.stock = nuevo;
    this.props.updatedAt = new Date();
  }

  public estaDisponible(): boolean { return this.props.stock > 0; }

  // Getters
  public getId() { return this.props.id; }
  public getMarca() { return this.props.marca; }
  public getModelo() { return this.props.modelo; }
  public getAnio() { return this.props.anio; }
  public getPrecioBase() { return this.props.precioBase; }
  public getTipo() { return this.props.tipo; }
  public getStock() { return this.props.stock; }
  public getEspecificaciones() { return this.props.especificaciones; }
  public getCreatedAt() { return this.props.createdAt; }
  public getUpdatedAt() { return this.props.updatedAt; }

  public toJSON(): VehiculoData { return { ...this.props }; }
}