import React from "react";
import type { PlanFormState, PlanFormErrors } from "../types/plan.types";

interface PlanFormProps {
   formData: PlanFormState;
   errors: PlanFormErrors;
   isSubmitting: boolean;
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   onCancel: () => void;
   submitLabel?: string;
}

export const PlanForm: React.FC<PlanFormProps> = ({ formData, errors, isSubmitting, onChange, onSubmit, onCancel, submitLabel = "Guardar" }) => {
   return (
      <form onSubmit={onSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-300">Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={onChange} placeholder="Ej: Plan Clásico"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.nombre ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.nombre && <p className="mt-1 text-sm text-red-400">{errors.nombre}</p>}
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-300">Entrada Mínima (%) *</label>
               <input type="number" name="entradaMinima" value={formData.entradaMinima} onChange={onChange} placeholder="Ej: 10" min={0} max={100}
                  className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.entradaMinima ? "border-red-500" : ""}`}
                  disabled={isSubmitting} />
               {errors.entradaMinima && <p className="mt-1 text-sm text-red-400">{errors.entradaMinima}</p>}
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300">Tasa Interés Anual (%) *</label>
               <input type="number" name="tasaInteresAnual" value={formData.tasaInteresAnual} onChange={onChange} placeholder="Ej: 12.5" min={0} step="0.01"
                  className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.tasaInteresAnual ? "border-red-500" : ""}`}
                  disabled={isSubmitting} />
               {errors.tasaInteresAnual && <p className="mt-1 text-sm text-red-400">{errors.tasaInteresAnual}</p>}
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Plazos Disponibles (meses) *</label>
            <input type="text" name="plazosDisponibles" value={formData.plazosDisponibles} onChange={onChange}
               placeholder="Ej: 12, 24, 36, 48 (separados por coma)"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.plazosDisponibles ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.plazosDisponibles && <p className="mt-1 text-sm text-red-400">{errors.plazosDisponibles}</p>}
            <p className="mt-1 text-xs text-slate-500">Ingrese los plazos separados por coma</p>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Comisión (%)</label>
            <input type="number" name="comision" value={formData.comision} onChange={onChange} placeholder="Ej: 2" min={0} step="0.01"
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting} />
         </div>
         <div className="flex items-center">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={onChange}
               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#1e2d50] bg-[#0a1225] rounded" disabled={isSubmitting} />
            <label className="ml-2 block text-sm text-slate-300">Plan activo</label>
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
