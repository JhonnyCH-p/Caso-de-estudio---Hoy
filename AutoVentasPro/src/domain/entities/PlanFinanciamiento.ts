export interface DatosPlanFinanciamiento {
    id: string;
    nombre: string;
    entradaMinima: number;
    tasaInteresAnual: number;
    plazosDisponibles: string;
    comision: number;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export class PlanFinanciamiento {
    private id: string;
    private nombre: string;
    private entradaMinima: number;
    private tasaInteresAnual: number;
    private plazosDisponibles: string;
    private comision: number;
    private activo: boolean;
    private createdAt: string;
    private updatedAt: string;

    private constructor(data: DatosPlanFinanciamiento) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.entradaMinima = data.entradaMinima;
        this.tasaInteresAnual = data.tasaInteresAnual;
        this.plazosDisponibles = data.plazosDisponibles;
        this.comision = data.comision;
        this.activo = data.activo;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.validar();
    }

    static crear(
        nombre: string,
        entradaMinima: number,
        tasaInteresAnual: number,
        plazosDisponibles: number[],
        comision: number = 0,
    ): PlanFinanciamiento {
        const now = new Date().toISOString();
        const id = 'PLAN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new PlanFinanciamiento({
            id,
            nombre: nombre.trim(),
            entradaMinima,
            tasaInteresAnual,
            plazosDisponibles: JSON.stringify(plazosDisponibles),
            comision,
            activo: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static desdeDatos(data: DatosPlanFinanciamiento): PlanFinanciamiento {
        return new PlanFinanciamiento(data);
    }

    private validar(): void {
        if (!this.nombre || this.nombre.trim().length < 2) throw new Error('El nombre debe tener al menos 2 caracteres');
        if (this.entradaMinima < 0 || this.entradaMinima > 100) throw new Error('La entrada mínima debe ser entre 0 y 100');
        if (this.tasaInteresAnual < 0) throw new Error('La tasa de interés no puede ser negativa');
        if (this.comision < 0) throw new Error('La comisión no puede ser negativa');
        try {
            const plazos = JSON.parse(this.plazosDisponibles);
            if (!Array.isArray(plazos) || plazos.length === 0) throw new Error();
            if (plazos.some((p: number) => p <= 0)) throw new Error();
        } catch {
            throw new Error('Los plazos disponibles deben ser un array de números positivos');
        }
    }

    getId(): string { return this.id; }
    getNombre(): string { return this.nombre; }
    getEntradaMinima(): number { return this.entradaMinima; }
    getTasaInteresAnual(): number { return this.tasaInteresAnual; }
    getPlazosDisponibles(): number[] { return JSON.parse(this.plazosDisponibles); }
    getPlazosDisponiblesRaw(): string { return this.plazosDisponibles; }
    getComision(): number { return this.comision; }
    isActivo(): boolean { return this.activo; }
    getCreatedAt(): string { return this.createdAt; }
    getUpdatedAt(): string { return this.updatedAt; }

    setNombre(nombre: string): void { this.nombre = nombre.trim(); this.actualizar(); }
    setEntradaMinima(valor: number): void { this.entradaMinima = valor; this.actualizar(); }
    setTasaInteresAnual(tasa: number): void { this.tasaInteresAnual = tasa; this.actualizar(); }
    setPlazosDisponibles(plazos: number[]): void { this.plazosDisponibles = JSON.stringify(plazos); this.actualizar(); }
    setComision(comision: number): void { this.comision = comision; this.actualizar(); }

    activar(): void { this.activo = true; this.actualizar(); }
    desactivar(): void { this.activo = false; this.actualizar(); }

    calcularCuota(montoFinanciado: number, plazoMeses: number): number {
        const plazos = this.getPlazosDisponibles();
        if (!plazos.includes(plazoMeses)) throw new Error(`Plazo ${plazoMeses} no disponible`);
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        if (tasaMensual === 0) return Math.round((montoFinanciado / plazoMeses) * 100) / 100;
        const cuota = montoFinanciado * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses) /
                      (Math.pow(1 + tasaMensual, plazoMeses) - 1);
        return Math.round(cuota * 100) / 100;
    }

    private actualizar(): void {
        this.updatedAt = new Date().toISOString();
        this.validar();
    }

    toJSON(): DatosPlanFinanciamiento {
        return {
            id: this.id,
            nombre: this.nombre,
            entradaMinima: this.entradaMinima,
            tasaInteresAnual: this.tasaInteresAnual,
            plazosDisponibles: this.plazosDisponibles,
            comision: this.comision,
            activo: this.activo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
