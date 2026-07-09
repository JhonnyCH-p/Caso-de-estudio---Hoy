import { apiClient } from './client';
import type { Usuario, CrearUsuarioRequest, ActualizarUsuarioRequest } from '../types/usuario.types';

const API_URL = '/api/usuarios';

export const UsuarioAPI = {
   async getAll(): Promise<Usuario[]> {
      const response = await apiClient.get<{ ok: boolean; data: Usuario[] }>(API_URL);
      return response.data.data;
   },

   async getById(id: string): Promise<Usuario> {
      const response = await apiClient.get<{ ok: boolean; data: Usuario }>(`${API_URL}/${id}`);
      return response.data.data;
   },

   async create(data: CrearUsuarioRequest): Promise<Usuario> {
      const response = await apiClient.post<{ ok: boolean; data: Usuario }>(API_URL, data);
      return response.data.data;
   },

   async update(id: string, data: ActualizarUsuarioRequest): Promise<Usuario> {
      const response = await apiClient.put<{ ok: boolean; data: Usuario }>(`${API_URL}/${id}`, data);
      return response.data.data;
   },

   async delete(id: string): Promise<void> {
      await apiClient.delete(`${API_URL}/${id}`);
   },
};
