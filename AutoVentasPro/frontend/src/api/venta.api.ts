import { apiClient } from './client';
import type { Venta, CrearVentaRequest, CambiarEstadoVentaRequest, VentaStatsResponse } from '../types/venta.types';

const API_URL = '/api/ventas';

export const VentaAPI = {
   async getAll(): Promise<Venta[]> {
      const response = await apiClient.get<{ count: number; data: Venta[] }>(API_URL);
      return response.data.data;
   },

   async getById(id: string): Promise<Venta> {
      const response = await apiClient.get<{ data: Venta }>(`${API_URL}/${id}`);
      return response.data.data;
   },

   async create(data: CrearVentaRequest): Promise<Venta> {
      const response = await apiClient.post<{ data: Venta }>(API_URL, data);
      return response.data.data;
   },

   async updateStatus(id: string, data: CambiarEstadoVentaRequest): Promise<Venta> {
      const response = await apiClient.patch<{ data: Venta }>(`${API_URL}/${id}/estado`, data);
      return response.data.data;
   },

   async delete(id: string): Promise<void> {
      await apiClient.delete(`${API_URL}/${id}`);
   },

   async getStats(): Promise<VentaStatsResponse> {
      const response = await apiClient.get<{ data: VentaStatsResponse }>(`${API_URL}/stats`);
      return response.data.data;
   },

   async getByAsesor(asesorId: string): Promise<Venta[]> {
      const response = await apiClient.get<{ data: Venta[] }>(`${API_URL}/asesor/${asesorId}`);
      return response.data.data;
   },
};
