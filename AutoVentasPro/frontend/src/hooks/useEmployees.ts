// 📁 src/hooks/useEmployees.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { EmployeeAPI } from '../api/employee.api';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../types/employee.types';

/**
 * Extrae un mensaje de error de forma segura sin usar any
 */
function getErrorMessage(error: unknown): string
{
   // Si es un objeto con respuesta de API
   if (typeof error === 'object' && error !== null)
   {
      const err = error as { response?: { data?: { error?: string; message?: string } } };

      if (err.response?.data?.error){
         return err.response.data.error;
      }

      if (err.response?.data?.message){
         return err.response.data.message;
      }
   }

   // Si es una instancia de Error
   if (error instanceof Error){
      return error.message;
   }

   // Si es un string
   if (typeof error === 'string'){
      return error;
   }

   // Error desconocido
   return 'Ocurrió un error inesperado';
}

interface UseEmployeesReturn
{
   employees: Employee[];
   loading: boolean;
   error: string | null;
   fetchAll: () => Promise<void>;
   create: (data: CreateEmployeeRequest) => Promise<Employee | null>;
   update: (id: string, data: UpdateEmployeeRequest) => Promise<Employee | null>;
   remove: (id: string) => Promise<boolean>;
   increaseSalary: (id: string, percentage: number) => Promise<Employee | null>;
}

/**
 * Hook personalizado para gestionar empleados
 */
export function useEmployees(): UseEmployeesReturn
{
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   // ✅ Flag para evitar ejecución duplicada en StrictMode
   const isMounted = useRef(false);
   /**
    * Cargar todos los empleados
    */
   const fetchAll = useCallback(async (): Promise<void> =>
   {
      setLoading(true);
      setError(null);
      try{
         const data = await EmployeeAPI.getAll();
         setEmployees(data);
      } 
      catch (err: unknown){
         const message = getErrorMessage(err);
         setError(message);
         console.error('Error fetching employees:', err);
      } 
      finally{
         setLoading(false);
      }
   }, []);

   /**
    * Crear un nuevo empleado
    */
   const create = useCallback(async (data: CreateEmployeeRequest): Promise<Employee | null> =>
   {
      setLoading(true);
      setError(null);
      try{
         const newEmployee = await EmployeeAPI.create(data);
         setEmployees(prev => [...prev, newEmployee]);
         return newEmployee;
      } 
      catch (err: unknown){
         const message = getErrorMessage(err);
         setError(message);
         console.error('Error creating employee:', err);
         return null;
      } 
      finally{
         setLoading(false);
      }
   }, []);

   /**
    * Actualizar un empleado
    */
   const update = useCallback(async (id: string, data: UpdateEmployeeRequest): Promise<Employee | null> =>
   {
      setLoading(true);
      setError(null);
      try
      {
         const updated = await EmployeeAPI.update(id, data);
         setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
         return updated;
      } catch (err: unknown)
      {
         const message = getErrorMessage(err);
         setError(message);
         console.error('Error updating employee:', err);
         return null;
      } finally
      {
         setLoading(false);
      }
   }, []);

   /**
    * Eliminar un empleado
    */
   const remove = useCallback(async (id: string): Promise<boolean> =>
   {
      setLoading(true);
      setError(null);
      try
      {
         await EmployeeAPI.delete(id);
         setEmployees(prev => prev.filter(emp => emp.id !== id));
         return true;
      } catch (err: unknown)
      {
         const message = getErrorMessage(err);
         setError(message);
         console.error('Error deleting employee:', err);
         return false;
      } finally
      {
         setLoading(false);
      }
   }, []);

   /**
    * Aumentar salario de un empleado
    */
   const increaseSalary = useCallback(async (id: string, percentage: number): Promise<Employee | null> =>
   {
      setLoading(true);
      setError(null);
      try
      {
         const updated = await EmployeeAPI.increaseSalary(id, percentage);
         setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
         return updated;
      } catch (err: unknown)
      {
         const message = getErrorMessage(err);
         setError(message);
         console.error('Error increasing salary:', err);
         return null;
      } finally
      {
         setLoading(false);
      }
   }, []);

   // Cargar empleados al montar el componente
   useEffect(() =>
   {
      if (!isMounted.current) {
         isMounted.current = true;
         fetchAll();
      }
   }, [fetchAll]);

   return {
      employees,
      loading,
      error,
      fetchAll,
      create,
      update,
      remove,
      increaseSalary,
   };
}