import { apiClient } from './client';

export interface AuthUser {
   id: string;
   usuario: string;
   rol: 'asesor' | 'jefe_ventas' | 'administrador';
}

export interface LoginResult {
   token: string;
   user: AuthUser;
}

export const AuthAPI = {
   async login(usuario: string, password: string): Promise<LoginResult> {
      const response = await apiClient.post<{ data: LoginResult }>('/api/auth/login', { usuario, password });
      return response.data.data;
   },

   async getProfile(): Promise<AuthUser> {
      const response = await apiClient.get<{ data: AuthUser }>('/api/auth/me');
      return response.data.data;
   },
};
