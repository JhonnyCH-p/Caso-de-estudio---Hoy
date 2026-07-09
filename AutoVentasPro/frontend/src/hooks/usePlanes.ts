import { useState, useEffect, useCallback, useRef } from 'react';
import { PlanAPI } from '../api/plan.api';
import type { PlanFinanciamiento, CrearPlanRequest, ActualizarPlanRequest } from '../types/plan.types';

function getErrorMessage(error: unknown): string {
   if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: { error?: string; message?: string } } };
      if (err.response?.data?.error) return err.response.data.error;
      if (err.response?.data?.message) return err.response.data.message;
   }
   if (error instanceof Error) return error.message;
   if (typeof error === 'string') return error;
   return 'Ocurrió un error inesperado';
}

interface UsePlanesReturn {
   planes: PlanFinanciamiento[];
   loading: boolean;
   error: string | null;
   fetchAll: () => Promise<void>;
   create: (data: CrearPlanRequest) => Promise<PlanFinanciamiento | null>;
   update: (id: string, data: ActualizarPlanRequest) => Promise<PlanFinanciamiento | null>;
   remove: (id: string) => Promise<boolean>;
}

export function usePlanes(): UsePlanesReturn {
   const [planes, setPlanes] = useState<PlanFinanciamiento[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const isMounted = useRef(false);

   const fetchAll = useCallback(async () => {
      setLoading(true); setError(null);
      try { const data = await PlanAPI.getAll(); setPlanes(data); }
      catch (err: unknown) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
   }, []);

   const create = useCallback(async (data: CrearPlanRequest): Promise<PlanFinanciamiento | null> => {
      setLoading(true); setError(null);
      try { const nuevo = await PlanAPI.create(data); setPlanes(prev => [...prev, nuevo]); return nuevo; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const update = useCallback(async (id: string, data: ActualizarPlanRequest): Promise<PlanFinanciamiento | null> => {
      setLoading(true); setError(null);
      try { const updated = await PlanAPI.update(id, data); setPlanes(prev => prev.map(p => p.id === id ? updated : p)); return updated; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const remove = useCallback(async (id: string): Promise<boolean> => {
      setLoading(true); setError(null);
      try { await PlanAPI.delete(id); setPlanes(prev => prev.filter(p => p.id !== id)); return true; }
      catch (err: unknown) { setError(getErrorMessage(err)); return false; }
      finally { setLoading(false); }
   }, []);

   useEffect(() => { if (!isMounted.current) { isMounted.current = true; fetchAll(); } }, [fetchAll]);

   return { planes, loading, error, fetchAll, create, update, remove };
}
