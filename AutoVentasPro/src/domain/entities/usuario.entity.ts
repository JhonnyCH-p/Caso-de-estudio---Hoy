export type RolUsuario = 'asesor' | 'jefe_ventas' | 'administrador';

export interface DatosUsuario {
    id: string;
    usuario: string;
    passwordHash: string;
    rol: RolUsuario;
    activo: boolean;
    ultimoAcceso: Date | null;
    especialidad?: string;
    experienciaAnios?: number;
    metaMensual?: number;
    areaResponsable?: string;
    bonoGestion?: number;
    nivelPermiso?: string;
    fechaCreacion: Date;
}

export class Usuario {
    private id: string;
    private usuario: string;
    private passwordHash: string;
    private rol: RolUsuario;
    private activo: boolean;
    private ultimoAcceso: Date | null;
    private especialidad?: string;
    private experienciaAnios?: number;
    private metaMensual?: number;
    private areaResponsable?: string;
    private bonoGestion?: number;
    private nivelPermiso?: string;
    private fechaCreacion: Date;

    private constructor(data: DatosUsuario) {
        this.id = data.id;
        this.usuario = data.usuario;
        this.passwordHash = data.passwordHash;
        this.rol = data.rol;
        this.activo = data.activo;
        this.ultimoAcceso = data.ultimoAcceso;
        this.especialidad = data.especialidad;
        this.experienciaAnios = data.experienciaAnios;
        this.metaMensual = data.metaMensual;
        this.areaResponsable = data.areaResponsable;
        this.bonoGestion = data.bonoGestion;
        this.nivelPermiso = data.nivelPermiso;
        this.fechaCreacion = data.fechaCreacion;
        this.validar();
    }

    static crear(
        usuario: string,
        passwordHash: string,
        rol: RolUsuario,
        extras?: {
            especialidad?: string;
            experienciaAnios?: number;
            metaMensual?: number;
            areaResponsable?: string;
            bonoGestion?: number;
            nivelPermiso?: string;
        }
    ): Usuario {
        const id = 'USR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Usuario({
            id,
            usuario: usuario.trim().toLowerCase(),
            passwordHash,
            rol,
            activo: true,
            ultimoAcceso: null,
            ...extras,
            fechaCreacion: new Date()
        });
    }

    static desdeDatos(data: DatosUsuario): Usuario {
        return new Usuario(data);
    }

    private validar(): void {
        if (!this.usuario || this.usuario.length < 4) throw new Error('El usuario debe tener al menos 4 caracteres');
        if (!this.passwordHash || this.passwordHash.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
        if (!['asesor', 'jefe_ventas', 'administrador'].includes(this.rol)) throw new Error('Rol no válido');
    }

    getId(): string { return this.id; }
    getUsuario(): string { return this.usuario; }
    getPasswordHash(): string { return this.passwordHash; }
    getRol(): RolUsuario { return this.rol; }
    isActivo(): boolean { return this.activo; }
    getUltimoAcceso(): Date | null { return this.ultimoAcceso; }
    getEspecialidad(): string | undefined { return this.especialidad; }
    getExperienciaAnios(): number | undefined { return this.experienciaAnios; }
    getMetaMensual(): number | undefined { return this.metaMensual; }
    getAreaResponsable(): string | undefined { return this.areaResponsable; }
    getBonoGestion(): number | undefined { return this.bonoGestion; }
    getNivelPermiso(): string | undefined { return this.nivelPermiso; }
    getFechaCreacion(): Date { return this.fechaCreacion; }

    esRol(rol: RolUsuario): boolean { return this.rol === rol; }
    esAsesor(): boolean { return this.rol === 'asesor'; }
    esJefeVentas(): boolean { return this.rol === 'jefe_ventas'; }
    esAdministrador(): boolean { return this.rol === 'administrador'; }

    verificarPassword(passwordHash: string): boolean {
        return this.passwordHash === passwordHash;
    }

    cambiarPassword(nuevoHash: string): void {
        if (!nuevoHash || nuevoHash.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
        this.passwordHash = nuevoHash;
    }

    registrarAcceso(): void {
        this.ultimoAcceso = new Date();
    }

    activar(): void { this.activo = true; }
    desactivar(): void { this.activo = false; }

    calcularComision(valorVenta: number): number {
        if (this.rol !== 'asesor') throw new Error('Solo los asesores pueden calcular comisión');
        const tasa = this.metaMensual && this.metaMensual > 0 ? 0.03 : 0.02;
        return valorVenta * tasa;
    }

    toJSON(): DatosUsuario {
        return {
            id: this.id, usuario: this.usuario, passwordHash: this.passwordHash,
            rol: this.rol, activo: this.activo, ultimoAcceso: this.ultimoAcceso,
            especialidad: this.especialidad, experienciaAnios: this.experienciaAnios,
            metaMensual: this.metaMensual, areaResponsable: this.areaResponsable,
            bonoGestion: this.bonoGestion, nivelPermiso: this.nivelPermiso,
            fechaCreacion: this.fechaCreacion
        };
    }

    toString(): string {
        return `Usuario[id=${this.id}, ${this.usuario}, rol=${this.rol}]`;
    }
}