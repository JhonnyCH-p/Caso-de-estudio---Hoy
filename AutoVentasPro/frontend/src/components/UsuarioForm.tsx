import React from 'react';
import type { UsuarioFormState } from '../types/usuario.types';

interface UsuarioFormProps {
   formData: UsuarioFormState;
   isSubmitting: boolean;
   isEdit: boolean;
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   onCancel: () => void;
   onPasswordChange?: () => void;
}

const ROLES = ['asesor', 'jefe_ventas', 'administrador'];

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ formData, isSubmitting, isEdit, onChange, onSubmit, onCancel, onPasswordChange }) => {
   return (
      <form onSubmit={onSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-300">Usuario *</label>
            <input type="text" name="usuario" value={formData.usuario} onChange={onChange}
               placeholder="Nombre de usuario" className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting} />
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">
               {isEdit ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña *'}
            </label>
            <div className="flex gap-2">
               <input type="password" name="password" value={formData.password} onChange={onChange}
                  placeholder={isEdit ? 'Nueva contraseña' : 'Contraseña'}
                  className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting} />
               {isEdit && onPasswordChange && (
                  <button type="button" onClick={onPasswordChange}
                     className="mt-1 px-3 py-2 bg-blue-900/50 text-blue-400 text-sm rounded-md hover:bg-blue-800/50 shrink-0 border border-blue-800/50">
                     Cambiar
                  </button>
               )}
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Rol *</label>
            <select name="rol" value={formData.rol} onChange={onChange}
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting || isEdit}>
               <option value="" className="bg-[#0c1322]">Seleccione rol</option>
               {ROLES.map(r => <option key={r} value={r} className="bg-[#0c1322]">{r.replace('_', ' ')}</option>)}
            </select>
         </div>
         {formData.rol === 'asesor' && (
            <>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-300">Especialidad</label>
                     <input type="text" name="especialidad" value={formData.especialidad} onChange={onChange}
                        placeholder="Ej: autos, camionetas"
                        className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting} />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-300">Experiencia (años)</label>
                     <input type="number" name="experienciaAnios" value={formData.experienciaAnios} onChange={onChange}
                        min={0}
                        className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting} />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Meta mensual</label>
                  <input type="number" name="metaMensual" value={formData.metaMensual} onChange={onChange}
                     min={0} placeholder="Ej: 10"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
            </>
         )}
         {formData.rol === 'jefe_ventas' && (
            <>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Área responsable</label>
                  <input type="text" name="areaResponsable" value={formData.areaResponsable} onChange={onChange}
                     placeholder="Ej: ventas, postventa"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Bono de gestión</label>
                  <input type="number" name="bonoGestion" value={formData.bonoGestion} onChange={onChange}
                     min={0} placeholder="Ej: 500"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
            </>
         )}
         {formData.rol === 'administrador' && (
            <div>
               <label className="block text-sm font-medium text-slate-300">Nivel de permiso</label>
               <input type="text" name="nivelPermiso" value={formData.nivelPermiso} onChange={onChange}
                  placeholder="Ej: total"
                  className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting} />
            </div>
         )}
         <div className="flex items-center">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={onChange}
               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#1e2d50] bg-[#0a1225] rounded" disabled={isSubmitting} />
            <label className="ml-2 block text-sm text-slate-300">Cuenta activa</label>
         </div>
         <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2d50]">
            <button type="button" onClick={onCancel}
               className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#0a1225] border border-[#1e2d50] rounded-md hover:bg-[#111c38] transition-colors"
               disabled={isSubmitting}>Cancelar</button>
            <button type="submit"
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
               disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Usuario'}</button>
         </div>
      </form>
   );
};
