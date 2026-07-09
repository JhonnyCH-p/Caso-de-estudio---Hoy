import { useState, useEffect, useCallback, useRef } from 'react';
import { VehiculoAPI } from '../api/vehiculo.api';
import type { Vehiculo, CrearVehiculoRequest, ActualizarVehiculoRequest } from '../types/vehiculo.types';

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

interface UseVehiculosReturn {
   vehiculos: Vehiculo[];
   loading: boolean;
   error: string | null;
   fetchAll: () => Promise<void>;
   create: (data: CrearVehiculoRequest) => Promise<Vehiculo | null>;
   update: (id: string, data: ActualizarVehiculoRequest) => Promise<Vehiculo | null>;
   remove: (id: string) => Promise<boolean>;
   adjustStock: (id: string, cantidad: number) => Promise<Vehiculo | null>;
}

export function useVehiculos(): UseVehiculosReturn {
   const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const isMounted = useRef(false);

   const fetchAll = useCallback(async () => {
      setLoading(true); setError(null);
      try { const data = await VehiculoAPI.getAll(); setVehiculos(data); }
      catch (err: unknown) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
   }, []);

   const create = useCallback(async (data: CrearVehiculoRequest): Promise<Vehiculo | null> => {
      setLoading(true); setError(null);
      try { const nuevo = await VehiculoAPI.create(data); setVehiculos(prev => [...prev, nuevo]); return nuevo; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const update = useCallback(async (id: string, data: ActualizarVehiculoRequest): Promise<Vehiculo | null> => {
      setLoading(true); setError(null);
      try { const updated = await VehiculoAPI.update(id, data); setVehiculos(prev => prev.map(v => v.id === id ? updated : v)); return updated; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   const remove = useCallback(async (id: string): Promise<boolean> => {
      setLoading(true); setError(null);
      try { await VehiculoAPI.delete(id); setVehiculos(prev => prev.filter(v => v.id !== id)); return true; }
      catch (err: unknown) { setError(getErrorMessage(err)); return false; }
      finally { setLoading(false); }
   }, []);

   const adjustStock = useCallback(async (id: string, cantidad: number): Promise<Vehiculo | null> => {
      setLoading(true); setError(null);
      try { const updated = await VehiculoAPI.adjustStock(id, cantidad); setVehiculos(prev => prev.map(v => v.id === id ? updated : v)); return updated; }
      catch (err: unknown) { setError(getErrorMessage(err)); return null; }
      finally { setLoading(false); }
   }, []);

   useEffect(() => { if (!isMounted.current) { isMounted.current = true; fetchAll(); } }, [fetchAll]);

   return { vehiculos, loading, error, fetchAll, create, update, remove, adjustStock };
}
