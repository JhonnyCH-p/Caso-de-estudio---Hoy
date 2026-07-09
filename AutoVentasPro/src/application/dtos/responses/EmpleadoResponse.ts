export interface EmpleadoResponse {
    id: string;
    cedula: string;
    nombres: string;
    salario: number;
    departamento: string;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmpleadoListResponse {
    count: number;
    data: EmpleadoResponse[];
}

export interface EmpleadoStatsResponse {
    total: number;
    averageSalary: number;
    maxSalary: number;
    minSalary: number;
}
