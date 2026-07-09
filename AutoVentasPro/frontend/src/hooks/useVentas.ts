import { useState, useEffect, useCallback, useRef } from 'react';
import { VentaAPI } from '../api/venta.api';
import type { Venta, CrearVentaRequest, CambiarEstadoVentaRequest } from '../types/venta.types';

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

interface UseVentasReturn {
   ventas: Venta[];
   loading: boolean;
   error: string | null;
   fetchAll: () => Promise<void>;
   create: (data: CrearVentaRequest) => Promise<Venta | null>;
   updateStatus: (id: string, data: CambiarEstadoVentaRequest) => Promise<Venta | null>;
   remove: (id: string) => Promise<boolean>;
}

export function useVentas(): UseVentasReturn {
   const [ventas, setVentas] = useState<Venta[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const isMounted = useRef(false);

   const fetchAll = useCallback(async () => {
      setLoading(true); setError(null);
      try { const data = await VentaAPI.getAll(); setVentas(data); }
      catch (err: unknown) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
   }, []);

   const create = useCallback(async (data: CrearVentaRequest): Promise<Venta | null> => {
      setLoading(true); setError(null);
      try { const nueva = await VentaAPI.create(data); setVentas(prev => [...prev, nueva]); return nueva; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const updateStatus = useCallback(async (id: string, data: CambiarEstadoVentaRequest): Promise<Venta | null> => {
      setLoading(true); setError(null);
      try { const updated = await VentaAPI.updateStatus(id, data); setVentas(prev => prev.map(v => v.id === id ? updated : v)); return updated; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const remove = useCallback(async (id: string): Promise<boolean> => {
      setLoading(true); setError(null);
      try { await VentaAPI.delete(id); setVentas(prev => prev.filter(v => v.id !== id)); return true; }
      catch (err: unknown) { setError(getErrorMessage(err)); return false; }
      finally { setLoading(false); }
   }, []);

   useEffect(() => { if (!isMounted.current) { isMounted.current = true; fetchAll(); } }, [fetchAll]);

   return { ventas, loading, error, fetchAll, create, updateStatus, remove };
}
