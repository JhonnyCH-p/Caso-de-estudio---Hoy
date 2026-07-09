// 📁 src/api/employee.api.ts

import { apiClient } from './client';

import type {
   Employee,
   CreateEmployeeRequest,
   UpdateEmployeeRequest,
   EmployeeStatsResponse,
   EmployeeListResponse,
} from '../types/employee.types';

const API_URL = '/api/employees';

/**
 * Servicio API para operaciones de empleados
 */
export const EmployeeAPI = {
   /**
    * GET /api/employees
    * Listar todos los empleados
    */
   async getAll(): Promise<Employee[]>
   {
      const response = await apiClient.get<EmployeeListResponse>(API_URL);
      return response.data.data;
   },

   /**
    * GET /api/employees/:id
    * Obtener un empleado por ID
    */
   async getById(id: string): Promise<Employee>
   {
      const response = await apiClient.get<{ data: Employee }>(
         `${API_URL}/${id}`
      );
      return response.data.data;
   },

   /**
    * POST /api/employees
    * Crear un nuevo empleado
    */
   async create(data: CreateEmployeeRequest): Promise<Employee>
   {
      const response = await apiClient.post<{ data: Employee }>(
         API_URL,
         data
      );
      return response.data.data;
   },

   /**
    * PUT /api/employees/:id
    * Actualizar un empleado
    */
   async update(id: string, data: UpdateEmployeeRequest): Promise<Employee>
   {
      const response = await apiClient.put<{ data: Employee }>(
         `${API_URL}/${id}`,
         data
      );
      return response.data.data;
   },

   /**
    * DELETE /api/employees/:id
    * Eliminar un empleado
    */
   async delete(id: string): Promise<void>
   {
      await apiClient.delete(`${API_URL}/${id}`);
   },

   /**
    * GET /api/employees/stats
    * Obtener estadísticas
    */
   async getStats(): Promise<EmployeeStatsResponse>
   {
      const response = await apiClient.get<{ data: EmployeeStatsResponse }>(
         `${API_URL}/stats`
      );
      return response.data.data;
   },

   /**
    * PATCH /api/employees/:id/salary
    * Aumentar salario
    */
   async increaseSalary(id: string, percentage: number): Promise<Employee>
   {
      const response = await apiClient.patch<{ data: Employee }>(
         `${API_URL}/${id}/salary`,
         { percentage }
      );
      return response.data.data;
   },
};