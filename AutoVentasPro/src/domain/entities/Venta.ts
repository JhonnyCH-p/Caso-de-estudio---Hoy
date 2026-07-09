export type EstadoVenta = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA';

export interface DatosVenta {
    id: string;
    cotizacionId: string;
    asesorId: string;
    valorTotal: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
}

export class Venta {
    private id: string;
    private cotizacionId: string;
    private asesorId: string;
    private valorTotal: number;
    private estado: EstadoVenta;
    private createdAt: string;
    private updatedAt: string;

    private constructor(data: DatosVenta) {
        this.id = data.id;
        this.cotizacionId = data.cotizacionId;
        this.asesorId = data.asesorId;
        this.valorTotal = data.valorTotal;
        this.estado = data.estado as EstadoVenta;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.validar();
    }

    static crear(
        cotizacionId: string,
        asesorId: string,
        valorTotal: number,
    ): Venta {
        const now = new Date().toISOString();
        const id = 'VEN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Venta({
            id,
            cotizacionId,
            asesorId,
            valorTotal,
            estado: 'PENDIENTE',
            createdAt: now,
            updatedAt: now,
        });
    }

    static desdeDatos(data: DatosVenta): Venta {
        return new Venta(data);
    }

    private validar(): void {
        if (!this.cotizacionId) throw new Error('Cotización requerida');
        if (!this.asesorId) throw new Error('Asesor requerido');
        if (this.valorTotal <= 0) throw new Error('El valor total debe ser positivo');
        const estados: EstadoVenta[] = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];
        if (!estados.includes(this.estado)) throw new Error('Estado de venta inválido');
    }

    getId(): string { return this.id; }
    getCotizacionId(): string { return this.cotizacionId; }
    getAsesorId(): string { return this.asesorId; }
    getValorTotal(): number { return this.valorTotal; }
    getEstado(): EstadoVenta { return this.estado; }
    getCreatedAt(): string { return this.createdAt; }
    getUpdatedAt(): string { return this.updatedAt; }

    aprobar(): void { if (this.estado !== 'PENDIENTE') throw new Error('Solo ventas pendientes pueden aprobarse'); this.estado = 'APROBADA'; this.actualizar(); }
    rechazar(): void { this.estado = 'RECHAZADA'; this.actualizar(); }
    cancelar(): void { this.estado = 'CANCELADA'; this.actualizar(); }
    estaAprobada(): boolean { return this.estado === 'APROBADA'; }
    estaPendiente(): boolean { return this.estado === 'PENDIENTE'; }

    private actualizar(): void {
        this.updatedAt = new Date().toISOString();
    }

    toJSON(): DatosVenta {
        return {
            id: this.id,
            cotizacionId: this.cotizacionId,
            asesorId: this.asesorId,
            valorTotal: this.valorTotal,
            estado: this.estado,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
