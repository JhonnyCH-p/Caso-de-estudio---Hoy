import React, { useRef, useState } from "react";
import { apiClient } from "../api/client";
import type { VehiculoFormState, VehiculoFormErrors } from "../types/vehiculo.types";

interface VehiculoFormProps {
   formData: VehiculoFormState;
   errors: VehiculoFormErrors;
   isSubmitting: boolean;
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   onCancel: () => void;
   submitLabel?: string;
}

const TIPOS_VEHICULO = ["SUV", "Sedán", "Hatchback", "Camioneta", "Deportivo", "Eléctrico", "Híbrido"];

export const VehiculoForm: React.FC<VehiculoFormProps> = ({ formData, errors, isSubmitting, onChange, onSubmit, onCancel, submitLabel = "Guardar" }) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [uploading, setUploading] = useState(false);
   const [preview, setPreview] = useState(formData.imagen || "");

   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
         const fd = new FormData();
         fd.append("file", file);
         const res = await apiClient.post<{ url: string }>("/api/upload", fd);
         const url = res.data.url;
         setPreview(url);
         onChange({ target: { name: "imagen", value: url } } as any);
      } catch {
         alert("Error al subir la imagen");
      } finally {
         setUploading(false);
      }
   };

   return (
      <form onSubmit={onSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-300">Marca *</label>
            <input type="text" name="marca" value={formData.marca} onChange={onChange} placeholder="Ej: Toyota"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.marca ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.marca && <p className="mt-1 text-sm text-red-400">{errors.marca}</p>}
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Modelo *</label>
            <input type="text" name="modelo" value={formData.modelo} onChange={onChange} placeholder="Ej: Corolla"
               className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.modelo ? "border-red-500" : ""}`}
               disabled={isSubmitting} />
            {errors.modelo && <p className="mt-1 text-sm text-red-400">{errors.modelo}</p>}
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-300">Año *</label>
               <input type="number" name="anio" value={formData.anio} onChange={onChange} placeholder="Ej: 2024" min={2000} max={2030}
                  className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.anio ? "border-red-500" : ""}`}
                  disabled={isSubmitting} />
               {errors.anio && <p className="mt-1 text-sm text-red-400">{errors.anio}</p>}
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300">Precio Base *</label>
               <input type="number" name="precioBase" value={formData.precioBase} onChange={onChange} placeholder="Ej: 24500" min={0}
                  className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 ${errors.precioBase ? "border-red-500" : ""}`}
                  disabled={isSubmitting} />
               {errors.precioBase && <p className="mt-1 text-sm text-red-400">{errors.precioBase}</p>}
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-300">Tipo *</label>
               <select name="tipo" value={formData.tipo} onChange={onChange}
                  className={`mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 focus:border-blue-500 focus:ring-blue-500 ${errors.tipo ? "border-red-500" : ""}`}
                  disabled={isSubmitting}>
                  <option value="" className="bg-[#0c1322]">Seleccione tipo</option>
                  {TIPOS_VEHICULO.map(t => <option key={t} value={t} className="bg-[#0c1322]">{t}</option>)}
               </select>
               {errors.tipo && <p className="mt-1 text-sm text-red-400">{errors.tipo}</p>}
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300">Stock</label>
               <input type="number" name="stock" value={formData.stock} onChange={onChange} placeholder="0" min={0}
                  className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting} />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Especificaciones</label>
            <textarea name="especificaciones" value={formData.especificaciones} onChange={onChange} rows={3}
               placeholder='Ej: {"motor":"2.0L","transmision":"Automática"}'
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting} />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Imagen del vehículo</label>
            <div className="mt-1 flex items-center gap-4">
               <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  disabled={isSubmitting || uploading} />
               {uploading && <span className="text-sm text-blue-400">Subiendo...</span>}
            </div>
            {preview && (
               <div className="mt-2 relative inline-block">
                  <img src={preview} alt="Preview" className="h-24 w-32 object-cover rounded-lg border border-[#1e2d50]" />
                  <button type="button" onClick={() => { setPreview(""); onChange({ target: { name: "imagen", value: "" } } as any); }}
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600">×</button>
               </div>
            )}
         </div>
         <div className="flex items-center">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={onChange}
               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#1e2d50] rounded bg-[#0a1225]" disabled={isSubmitting} />
            <label className="ml-2 block text-sm text-slate-300">Vehículo activo</label>
         </div>
         <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2d50]">
            <button type="button" onClick={onCancel}
               className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#0a1225] border border-[#1e2d50] rounded-md hover:bg-[#111c38] transition-colors"
               disabled={isSubmitting}>Cancelar</button>
            <button type="submit"
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
               disabled={isSubmitting || uploading}>{isSubmitting || uploading ? "Guardando..." : submitLabel}</button>
         </div>
      </form>
   );
};
