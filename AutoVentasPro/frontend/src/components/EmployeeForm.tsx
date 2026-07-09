// 📁 src/components/EmployeeForm.tsx

import React from "react";
import type {
   EmployeeFormState,
   EmployeeFormErrors,
} from "../types/employee.types";

interface EmployeeFormProps {
   formData: EmployeeFormState;
   errors: EmployeeFormErrors;
   isSubmitting: boolean;
   onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   onCancel: () => void;
   title?: string;
   submitLabel?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
   formData,
   errors,
   isSubmitting,
   onChange,
   onSubmit,
   onCancel,
   submitLabel = "Guardar",
}) => {
   return (
      <form onSubmit={onSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-300">Cédula *</label>
            <input type="text" name="cedula" value={formData.cedula} onChange={onChange} placeholder="Ingrese la cédula"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.cedula ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.cedula && <p className="mt-1 text-sm text-red-400">{errors.cedula}</p>}
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Nombres *</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={onChange} placeholder="Ingrese los nombres"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.nombres ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.nombres && <p className="mt-1 text-sm text-red-400">{errors.nombres}</p>}
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Salario *</label>
            <input type="number" name="salario" value={formData.salario} onChange={onChange} placeholder="Ingrese el salario"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.salario ? "border-red-500" : ""}`}
               disabled={isSubmitting} step="0.01" />
            {errors.salario && <p className="mt-1 text-sm text-red-400">{errors.salario}</p>}
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Departamento</label>
            <select name="departamento" value={formData.departamento} onChange={onChange}
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting}>
               <option value="" className="bg-[#0c1322]">Seleccione un departamento</option>
               <option value="Ventas" className="bg-[#0c1322]">Ventas</option>
               <option value="Marketing" className="bg-[#0c1322]">Marketing</option>
               <option value="Tecnología" className="bg-[#0c1322]">Tecnología</option>
               <option value="Finanzas" className="bg-[#0c1322]">Finanzas</option>
               <option value="Recursos Humanos" className="bg-[#0c1322]">Recursos Humanos</option>
            </select>
         </div>
         <div className="flex items-center">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={onChange}
               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#1e2d50] rounded bg-[#0a1225]" disabled={isSubmitting} />
            <label className="ml-2 block text-sm text-slate-300">Empleado activo</label>
         </div>
         <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2d50]">
            <button type="button" onClick={onCancel}
               className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#0a1225] border border-[#1e2d50] rounded-md hover:bg-[#111c38] transition-colors"
               disabled={isSubmitting}>Cancelar</button>
            <button type="submit"
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
               disabled={isSubmitting}>{isSubmitting ? "Guardando..." : submitLabel}</button>
         </div>
      </form>
   );
};
