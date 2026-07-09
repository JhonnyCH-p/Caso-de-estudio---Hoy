export interface DatosEmpleado {
    id: string;
    cedula: string;
    nombres: string;
    salario: number;
    departamento: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Empleado {
    private id: string;
    private cedula: string;
    private nombres: string;
    private salario: number;
    private departamento: string;
    private activo: boolean;
    private createdAt: string;
    private updatedAt: string;

    private constructor(data: DatosEmpleado) {
        this.id = data.id;
        this.cedula = data.cedula;
        this.nombres = data.nombres;
        this.salario = data.salario;
        this.departamento = data.departamento;
        this.activo = data.activo;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.validar();
    }

    static crear(
        cedula: string,
        nombres: string,
        salario: number,
        departamento?: string,
    ): Empleado {
        const now = new Date().toISOString();
        const id = 'EMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Empleado({
            id,
            cedula: cedula.trim(),
            nombres: nombres.trim(),
            salario,
            departamento: departamento?.trim() ?? '',
            activo: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static desdeDatos(data: DatosEmpleado): Empleado {
        return new Empleado(data);
    }

    private validar(): void {
        if (!this.cedula || this.cedula.length < 10) throw new Error('La cédula debe tener al menos 10 caracteres');
        if (!this.nombres || this.nombres.trim().length < 2) throw new Error('Los nombres deben tener al menos 2 caracteres');
        if (this.salario < 0) throw new Error('El salario no puede ser negativo');
    }

    getId(): string { return this.id; }
    getCedula(): string { return this.cedula; }
    getNombres(): string { return this.nombres; }
    getSalario(): number { return this.salario; }
    getDepartamento(): string { return this.departamento; }
    isActivo(): boolean { return this.activo; }
    getCreatedAt(): string { return this.createdAt; }
    getUpdatedAt(): string { return this.updatedAt; }

    setNombres(nombres: string): void {
        if (!nombres || nombres.trim().length < 2) throw new Error('Los nombres deben tener al menos 2 caracteres');
        this.nombres = nombres.trim();
        this.actualizar();
    }

    setSalario(salario: number): void {
        if (salario < 0) throw new Error('El salario no puede ser negativo');
        this.salario = salario;
        this.actualizar();
    }

    setDepartamento(departamento: string): void {
        this.departamento = departamento.trim();
        this.actualizar();
    }

    activar(): void { this.activo = true; this.actualizar(); }
    desactivar(): void { this.activo = false; this.actualizar(); }

    aumentarSalario(porcentaje: number): void {
        if (porcentaje <= 0 || porcentaje > 100) throw new Error('El porcentaje debe estar entre 1 y 100');
        this.salario = this.salario * (1 + porcentaje / 100);
        this.actualizar();
    }

    private actualizar(): void {
        this.updatedAt = new Date().toISOString();
    }

    toJSON(): DatosEmpleado {
        return {
            id: this.id, cedula: this.cedula, nombres: this.nombres,
            salario: this.salario, departamento: this.departamento,
            activo: this.activo, createdAt: this.createdAt, updatedAt: this.updatedAt,
        };
    }

    toString(): string {
        return `Empleado[id=${this.id}, ${this.nombres}, salario=$${this.salario.toFixed(2)}]`;
    }
}
