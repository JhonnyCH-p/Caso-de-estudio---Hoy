import { apiClient } from './client';
import type { Vehiculo, CrearVehiculoRequest, ActualizarVehiculoRequest } from '../types/vehiculo.types';

const API_URL = '/api/vehiculos';

export const VehiculoAPI = {
   async getAll(): Promise<Vehiculo[]> {
      const response = await apiClient.get<{ count: number; data: Vehiculo[] }>(API_URL);
      return response.data.data;
   },

   async getById(id: string): Promise<Vehiculo> {
      const response = await apiClient.get<{ data: Vehiculo }>(`${API_URL}/${id}`);
      return response.data.data;
   },

   async create(data: CrearVehiculoRequest): Promise<Vehiculo> {
      const response = await apiClient.post<{ data: Vehiculo }>(API_URL, data);
      return response.data.data;
   },

   async update(id: string, data: ActualizarVehiculoRequest): Promise<Vehiculo> {
      const response = await apiClient.put<{ data: Vehiculo }>(`${API_URL}/${id}`, data);
      return response.data.data;
   },

   async delete(id: string): Promise<void> {
      await apiClient.delete(`${API_URL}/${id}`);
   },

   async adjustStock(id: string, cantidad: number): Promise<Vehiculo> {
      const response = await apiClient.patch<{ data: Vehiculo }>(`${API_URL}/${id}/stock`, { cantidad });
      return response.data.data;
   },

   async getStats(): Promise<{ total: number; promedioPrecio: number; totalStock: number }> {
      const response = await apiClient.get<{ data: { total: number; promedioPrecio: number; totalStock: number } }>(`${API_URL}/stats`);
      return response.data.data;
   },
};
