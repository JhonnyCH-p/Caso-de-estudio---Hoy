import { useState, useEffect, useCallback, useRef } from 'react';
import { CotizacionAPI } from '../api/cotizacion.api';
import type { Cotizacion, CrearCotizacionRequest, CambiarEstadoCotizacionRequest } from '../types/cotizacion.types';

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

interface UseCotizacionesReturn {
   cotizaciones: Cotizacion[];
   loading: boolean;
   error: string | null;
   fetchAll: () => Promise<void>;
   create: (data: CrearCotizacionRequest) => Promise<Cotizacion | null>;
   updateStatus: (id: string, data: CambiarEstadoCotizacionRequest) => Promise<Cotizacion | null>;
   remove: (id: string) => Promise<boolean>;
}

export function useCotizaciones(): UseCotizacionesReturn {
   const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const isMounted = useRef(false);

   const fetchAll = useCallback(async () => {
      setLoading(true); setError(null);
      try { const data = await CotizacionAPI.getAll(); setCotizaciones(data); }
      catch (err: unknown) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
   }, []);

   const create = useCallback(async (data: CrearCotizacionRequest): Promise<Cotizacion | null> => {
      setLoading(true); setError(null);
      try { const nueva = await CotizacionAPI.create(data); setCotizaciones(prev => [...prev, nueva]); return nueva; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const updateStatus = useCallback(async (id: string, data: CambiarEstadoCotizacionRequest): Promise<Cotizacion | null> => {
      setLoading(true); setError(null);
      try { const updated = await CotizacionAPI.updateStatus(id, data); setCotizaciones(prev => prev.map(c => c.id === id ? updated : c)); return updated; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const remove = useCallback(async (id: string): Promise<boolean> => {
      setLoading(true); setError(null);
      try { await CotizacionAPI.delete(id); setCotizaciones(prev => prev.filter(c => c.id !== id)); return true; }
      catch (err: unknown) { setError(getErrorMessage(err)); return false; }
      finally { setLoading(false); }
   }, []);

   useEffect(() => { if (!isMounted.current) { isMounted.current = true; fetchAll(); } }, [fetchAll]);

   return { cotizaciones, loading, error, fetchAll, create, updateStatus, remove };
}
