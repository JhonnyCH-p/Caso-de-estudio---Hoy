export interface DatosClienteInfo {
    nombre: string;
    email: string;
    telefono: string;
    cedula: string;
    ciudad: string;
}

export class ClienteInfo {
    private nombre: string;
    private email: string;
    private telefono: string;
    private cedula: string;
    private ciudad: string;

    constructor(data: DatosClienteInfo) {
        this.nombre = data.nombre.trim();
        this.email = data.email.trim();
        this.telefono = data.telefono.trim();
        this.cedula = data.cedula.trim();
        this.ciudad = data.ciudad.trim();
        this.validar();
    }

    private validar(): void {
        if (!this.nombre || this.nombre.length < 2) throw new Error('El nombre del cliente debe tener al menos 2 caracteres');
        if (!this.email || !this.email.includes('@')) throw new Error('Email del cliente invalido');
        if (!this.telefono || this.telefono.length < 7) throw new Error('Telefono del cliente invalido');
        if (!this.cedula || this.cedula.length < 5) throw new Error('Cedula/identificacion invalida');
        if (!this.ciudad || this.ciudad.length < 2) throw new Error('Ciudad invalida');
    }

    getNombre(): string { return this.nombre; }
    getEmail(): string { return this.email; }
    getTelefono(): string { return this.telefono; }
    getCedula(): string { return this.cedula; }
    getCiudad(): string { return this.ciudad; }

    toJSON(): DatosClienteInfo {
        return { nombre: this.nombre, email: this.email, telefono: this.telefono, cedula: this.cedula, ciudad: this.ciudad };
    }
}
