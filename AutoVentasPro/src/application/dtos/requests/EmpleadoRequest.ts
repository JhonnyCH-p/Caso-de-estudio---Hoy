export interface CrearEmpleadoRequest {
    cedula: string;
    nombres: string;
    salario: number;
    departamento?: string;
}

export interface ActualizarEmpleadoRequest {
    nombres?: string;
    salario?: number;
    departamento?: string;
    activo?: boolean;
}

export interface AumentoSalarioRequest {
    percentage: number;
}
