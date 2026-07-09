export interface DatosVehiculo {
    id: string;
    marca: string;
    modelo: string;
    anio: number;
    precioBase: number;
    tipo: string;
    stock: number;
    especificaciones: string;
    imagen?: string | null;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Vehiculo {
    private id: string;
    private marca: string;
    private modelo: string;
    private anio: number;
    private precioBase: number;
    private tipo: string;
    private stock: number;
    private especificaciones: string;
    private imagen: string | null;
    private activo: boolean;
    private createdAt: string;
    private updatedAt: string;

    private constructor(data: DatosVehiculo) {
        this.id = data.id;
        this.marca = data.marca;
        this.modelo = data.modelo;
        this.anio = data.anio;
        this.precioBase = data.precioBase;
        this.tipo = data.tipo;
        this.stock = data.stock;
        this.especificaciones = data.especificaciones;
        this.imagen = data.imagen ?? null;
        this.activo = data.activo;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.validar();
    }

    static crear(
        marca: string,
        modelo: string,
        anio: number,
        precioBase: number,
        tipo: string,
        stock: number = 0,
        especificaciones?: string,
        imagen?: string,
    ): Vehiculo {
        const now = new Date().toISOString();
        const id = 'VEH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Vehiculo({
            id,
            marca: marca.trim(),
            modelo: modelo.trim(),
            anio,
            precioBase,
            tipo,
            stock,
            especificaciones: especificaciones ?? '{}',
            imagen,
            activo: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static desdeDatos(data: DatosVehiculo): Vehiculo {
        return new Vehiculo(data);
    }

    private validar(): void {
        if (!this.marca || this.marca.length < 2) throw new Error('La marca debe tener al menos 2 caracteres');
        if (!this.modelo || this.modelo.length < 2) throw new Error('El modelo debe tener al menos 2 caracteres');
        if (this.anio < 1900 || this.anio > new Date().getFullYear() + 1) throw new Error('Año inválido');
        if (this.precioBase < 0) throw new Error('El precio base no puede ser negativo');
        if (this.stock < 0) throw new Error('El stock no puede ser negativo');
        const tipos = ['SEDAN', 'SUV', 'HATCHBACK', 'PICKUP', 'DEPORTIVO'];
        if (!tipos.includes(this.tipo)) throw new Error('Tipo de vehículo inválido');
    }

    getId(): string { return this.id; }
    getMarca(): string { return this.marca; }
    getModelo(): string { return this.modelo; }
    getAnio(): number { return this.anio; }
    getPrecioBase(): number { return this.precioBase; }
    getTipo(): string { return this.tipo; }
    getStock(): number { return this.stock; }
    getEspecificaciones(): string { return this.especificaciones; }
    getImagen(): string | null { return this.imagen; }
    isActivo(): boolean { return this.activo; }
    getCreatedAt(): string { return this.createdAt; }
    getUpdatedAt(): string { return this.updatedAt; }
    estaDisponible(): boolean { return this.stock > 0 && this.activo; }

    setMarca(marca: string): void { this.marca = marca.trim(); this.actualizar(); }
    setModelo(modelo: string): void { this.modelo = modelo.trim(); this.actualizar(); }
    setAnio(anio: number): void { this.anio = anio; this.actualizar(); }
    setPrecioBase(precio: number): void { this.precioBase = precio; this.actualizar(); }
    setTipo(tipo: string): void { this.tipo = tipo; this.actualizar(); }
    setEspecificaciones(esp: string): void { this.especificaciones = esp; this.actualizar(); }
    setImagen(imagen: string | null): void { this.imagen = imagen; this.actualizar(); }

    activar(): void { this.activo = true; this.actualizar(); }
    desactivar(): void { this.activo = false; this.actualizar(); }

    ajustarStock(cantidad: number): void {
        const nuevo = this.stock + cantidad;
        if (nuevo < 0) throw new Error('Stock insuficiente');
        this.stock = nuevo;
        this.actualizar();
    }

    private actualizar(): void {
        this.updatedAt = new Date().toISOString();
        this.validar();
    }

    toJSON(): DatosVehiculo {
        return {
            id: this.id,
            marca: this.marca,
            modelo: this.modelo,
            anio: this.anio,
            precioBase: this.precioBase,
            tipo: this.tipo,
            stock: this.stock,
            especificaciones: this.especificaciones,
            imagen: this.imagen,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
