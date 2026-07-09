import { apiClient } from './client';
import type { PlanFinanciamiento, CrearPlanRequest, ActualizarPlanRequest } from '../types/plan.types';

const API_URL = '/api/planes';

export const PlanAPI = {
   async getAll(): Promise<PlanFinanciamiento[]> {
      const response = await apiClient.get<{ count: number; data: PlanFinanciamiento[] }>(API_URL);
      return response.data.data;
   },

   async getById(id: string): Promise<PlanFinanciamiento> {
      const response = await apiClient.get<{ data: PlanFinanciamiento }>(`${API_URL}/${id}`);
      return response.data.data;
   },

   async create(data: CrearPlanRequest): Promise<PlanFinanciamiento> {
      const response = await apiClient.post<{ data: PlanFinanciamiento }>(API_URL, data);
      return response.data.data;
   },

   async update(id: string, data: ActualizarPlanRequest): Promise<PlanFinanciamiento> {
      const response = await apiClient.put<{ data: PlanFinanciamiento }>(`${API_URL}/${id}`, data);
      return response.data.data;
   },

   async delete(id: string): Promise<void> {
      await apiClient.delete(`${API_URL}/${id}`);
   },
};
