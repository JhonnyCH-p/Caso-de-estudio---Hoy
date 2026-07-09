import { apiClient } from './client';
import type { DashboardData } from '../types/dashboard.types';

export const DashboardAPI = {
   async get(): Promise<DashboardData> {
      const response = await apiClient.get<{ data: DashboardData }>('/api/dashboard');
      return response.data.data;
   },
};
