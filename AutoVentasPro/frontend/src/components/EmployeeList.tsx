import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Employee } from "../types/employee.types";

interface EmployeeListProps {
   employees: Employee[];
   loading: boolean;
   error: string | null;
   onEdit?: (employee: Employee) => void;
   onDelete?: (id: string) => void;
   onIncreaseSalary?: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
   employees,
   loading,
   error,
   onEdit,
   onDelete,
   onIncreaseSalary,
}) => {
   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">
            ❌ Error: {error}
         </div>
      );
   }

   if (employees.length === 0) {
      return (
         <div className="text-center py-12 bg-[#0c1322] border border-[#1e2d50] rounded-lg">
            <p className="text-slate-400 text-lg">No hay empleados registrados</p>
         </div>
      );
   }

   const showActions = !!(onEdit || onDelete || onIncreaseSalary);

   return (
      <div className="overflow-x-auto shadow-md rounded-lg border border-[#1e2d50]">
         <table className="min-w-full bg-[#0c1322]">
            <thead className="bg-[#111c38] border-b border-[#1e2d50]">
               <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cédula</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nombres</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Salario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                  {showActions && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>}
               </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d50]">
               {employees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-[#111c38] transition-colors">
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{employee.cedula}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{employee.nombres}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">${employee.salario.toFixed(2)}</td>
                     <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${employee.activo ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                           {employee.activo ? "Activo" : "Inactivo"}
                        </span>
                     </td>
                     {showActions && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {onEdit && (
                              <button onClick={() => onEdit(employee)} className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                                 <PencilIcon className="h-5 w-5 inline" />
                              </button>
                           )}
                           {onIncreaseSalary && (
                              <button onClick={() => onIncreaseSalary(employee.id)} className="text-green-400 hover:text-green-300 mr-3 transition-colors">💰</button>
                           )}
                           {onDelete && (
                              <button onClick={() => onDelete(employee.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                 <TrashIcon className="h-5 w-5 inline" />
                              </button>
                           )}
                        </td>
                     )}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
