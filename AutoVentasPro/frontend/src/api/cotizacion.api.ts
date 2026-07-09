import { apiClient } from './client';
import type { Cotizacion, CrearCotizacionRequest, CambiarEstadoCotizacionRequest } from '../types/cotizacion.types';

const API_URL = '/api/cotizaciones';

export const CotizacionAPI = {
   async getAll(): Promise<Cotizacion[]> {
      const response = await apiClient.get<{ count: number; data: Cotizacion[] }>(API_URL);
      return response.data.data;
   },

   async getById(id: string): Promise<Cotizacion> {
      const response = await apiClient.get<{ data: Cotizacion }>(`${API_URL}/${id}`);
      return response.data.data;
   },

   async create(data: CrearCotizacionRequest): Promise<Cotizacion> {
      const response = await apiClient.post<{ data: Cotizacion }>(API_URL, data);
      return response.data.data;
   },

   async updateStatus(id: string, data: CambiarEstadoCotizacionRequest): Promise<Cotizacion> {
      const response = await apiClient.patch<{ data: Cotizacion }>(`${API_URL}/${id}/estado`, data);
      return response.data.data;
   },

   async delete(id: string): Promise<void> {
      await apiClient.delete(`${API_URL}/${id}`);
   },
};
