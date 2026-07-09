// 📁 src/types/employee.types.ts

// ============================================
// API TYPES (Backend)
// ============================================

export interface Employee {
   id: string;
   cedula: string;
   nombres: string;
   salario: number;
   departamento: string;
   activo: boolean;
   createdAt: string;
   updatedAt: string;
}

export interface CreateEmployeeRequest {
   cedula: string;
   nombres: string;
   salario: number;
   departamento?: string;
}

export interface UpdateEmployeeRequest {
   nombres?: string;
   salario?: number;
   departamento?: string;
   activo?: boolean;
}

export interface EmployeeListResponse {
   count: number;
   data: Employee[];
}

export interface EmployeeStatsResponse {
   total: number;
   averageSalary: number;
   maxSalary: number;
   minSalary: number;
}

// ============================================
// FRONTEND TYPES (Formularios)
// ============================================

export interface EmployeeFormState {
   cedula: string;
   nombres: string;
   salario: string;
   departamento: string;
   activo: boolean;
}

export interface EmployeeFormErrors {
   cedula?: string;
   nombres?: string;
   salario?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type EmployeeFormMode = 'create' | 'edit';