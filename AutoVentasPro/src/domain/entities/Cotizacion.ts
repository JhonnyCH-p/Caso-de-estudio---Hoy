import { ClienteInfo, type DatosClienteInfo } from '../value-objects/ClienteInfo.js';
import { TablaAmortizacion, type FilaAmortizacion } from '../value-objects/TablaAmortizacion.js';

export type EstadoCotizacion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'EXPIRADA';

export interface DatosCotizacion {
    id: string;
    vehiculoId: string;
    planId: string;
    clienteNombre: string;
    clienteEmail: string;
    clienteTelefono: string;
    clienteCedula: string;
    clienteCiudad: string;
    precioVehiculo: number;
    entrada: number;
    montoFinanciado: number;
    plazoMeses: number;
    tasaInteresAnual: number;
    cuotaMensual: number;
    tablaAmortizacion: string;
    estado: string;
    createdAt: string;
    updatedAt: string;
}

export class Cotizacion {
    private id: string;
    private vehiculoId: string;
    private planId: string;
    private cliente: ClienteInfo;
    private precioVehiculo: number;
    private entrada: number;
    private montoFinanciado: number;
    private plazoMeses: number;
    private tasaInteresAnual: number;
    private cuotaMensual: number;
    private tabla: TablaAmortizacion;
    private estado: EstadoCotizacion;
    private createdAt: string;
    private updatedAt: string;

    private constructor(data: DatosCotizacion) {
        this.id = data.id;
        this.vehiculoId = data.vehiculoId;
        this.planId = data.planId;
        this.cliente = new ClienteInfo({
            nombre: data.clienteNombre,
            email: data.clienteEmail,
            telefono: data.clienteTelefono,
            cedula: data.clienteCedula,
            ciudad: data.clienteCiudad,
        });
        this.precioVehiculo = data.precioVehiculo;
        this.entrada = data.entrada;
        this.montoFinanciado = data.montoFinanciado;
        this.plazoMeses = data.plazoMeses;
        this.tasaInteresAnual = data.tasaInteresAnual;
        this.cuotaMensual = data.cuotaMensual;
        this.tabla = new TablaAmortizacion(JSON.parse(data.tablaAmortizacion));
        this.estado = data.estado as EstadoCotizacion;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.validar();
    }

    static crear(
        vehiculoId: string,
        planId: string,
        cliente: ClienteInfo,
        precioVehiculo: number,
        entrada: number,
        plazoMeses: number,
        tasaInteresAnual: number,
        cuotaMensual: number,
        tabla: TablaAmortizacion,
    ): Cotizacion {
        const now = new Date().toISOString();
        const id = 'COT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Cotizacion({
            id,
            vehiculoId,
            planId,
            clienteNombre: cliente.getNombre(),
            clienteEmail: cliente.getEmail(),
            clienteTelefono: cliente.getTelefono(),
            clienteCedula: cliente.getCedula(),
            clienteCiudad: cliente.getCiudad(),
            precioVehiculo,
            entrada,
            montoFinanciado: precioVehiculo - entrada,
            plazoMeses,
            tasaInteresAnual,
            cuotaMensual,
            tablaAmortizacion: JSON.stringify(tabla.toJSON()),
            estado: 'PENDIENTE',
            createdAt: now,
            updatedAt: now,
        });
    }

    static desdeDatos(data: DatosCotizacion): Cotizacion {
        return new Cotizacion(data);
    }

    private validar(): void {
        if (!this.vehiculoId) throw new Error('Vehiculo requerido');
        if (!this.planId) throw new Error('Plan requerido');
        if (this.precioVehiculo <= 0) throw new Error('Precio del vehiculo invalido');
        if (this.entrada < 0) throw new Error('Entrada no puede ser negativa');
        if (this.entrada > this.precioVehiculo) throw new Error('Entrada no puede superar el precio');
        if (this.montoFinanciado <= 0) throw new Error('Monto a financiar invalido');
        if (this.plazoMeses <= 0) throw new Error('Plazo invalido');
        if (this.cuotaMensual <= 0) throw new Error('Cuota mensual invalida');
        const estados: EstadoCotizacion[] = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'EXPIRADA'];
        if (!estados.includes(this.estado)) throw new Error('Estado de cotizacion invalido');
    }

    getId(): string { return this.id; }
    getVehiculoId(): string { return this.vehiculoId; }
    getPlanId(): string { return this.planId; }
    getCliente(): ClienteInfo { return this.cliente; }
    getPrecioVehiculo(): number { return this.precioVehiculo; }
    getEntrada(): number { return this.entrada; }
    getMontoFinanciado(): number { return this.montoFinanciado; }
    getPlazoMeses(): number { return this.plazoMeses; }
    getTasaInteresAnual(): number { return this.tasaInteresAnual; }
    getCuotaMensual(): number { return this.cuotaMensual; }
    getTabla(): TablaAmortizacion { return this.tabla; }
    getEstado(): EstadoCotizacion { return this.estado; }
    getCreatedAt(): string { return this.createdAt; }
    getUpdatedAt(): string { return this.updatedAt; }

    aprobar(): void { this.estado = 'APROBADA'; this.actualizar(); }
    rechazar(): void { this.estado = 'RECHAZADA'; this.actualizar(); }
    expirar(): void { this.estado = 'EXPIRADA'; this.actualizar(); }
    estaAprobada(): boolean { return this.estado === 'APROBADA'; }
    estaPendiente(): boolean { return this.estado === 'PENDIENTE'; }

    private actualizar(): void {
        this.updatedAt = new Date().toISOString();
    }

    toJSON(): DatosCotizacion {
        return {
            id: this.id,
            vehiculoId: this.vehiculoId,
            planId: this.planId,
            clienteNombre: this.cliente.getNombre(),
            clienteEmail: this.cliente.getEmail(),
            clienteTelefono: this.cliente.getTelefono(),
            clienteCedula: this.cliente.getCedula(),
            clienteCiudad: this.cliente.getCiudad(),
            precioVehiculo: this.precioVehiculo,
            entrada: this.entrada,
            montoFinanciado: this.montoFinanciado,
            plazoMeses: this.plazoMeses,
            tasaInteresAnual: this.tasaInteresAnual,
            cuotaMensual: this.cuotaMensual,
            tablaAmortizacion: JSON.stringify(this.tabla.toJSON()),
            estado: this.estado,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
