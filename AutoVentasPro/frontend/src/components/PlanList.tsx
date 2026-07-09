import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { PlanFinanciamiento } from "../types/plan.types";

interface PlanListProps {
   planes: PlanFinanciamiento[];
   loading: boolean;
   error: string | null;
   onEdit?: (p: PlanFinanciamiento) => void;
   onDelete?: (id: string) => void;
}

export const PlanList: React.FC<PlanListProps> = ({ planes, loading, error, onEdit, onDelete }) => {
   if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
   if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">❌ Error: {error}</div>;
   if (planes.length === 0) return <div className="text-center py-12 bg-[#0c1322] rounded-lg"><p className="text-slate-400 text-lg">No hay planes financieros</p></div>;

   const showActions = !!(onEdit || onDelete);

   return (
      <div className="overflow-x-auto rounded-lg border border-[#1e2d50]">
         <table className="min-w-full bg-[#0c1322]">
            <thead className="bg-[#111c38] border-b border-[#1e2d50]">
               <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Entrada Mín</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tasa Anual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plazos (meses)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Comisión</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                  {showActions && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>}
               </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d50]">
               {planes.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#111c38] transition-colors">
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{i + 1}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{p.nombre}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{p.entradaMinima}%</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{p.tasaInteresAnual}%</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{p.plazosDisponibles?.join(", ") || "-"}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{p.comision ? `${p.comision}%` : "-"}</td>
                     <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.activo ? "bg-green-900/30 text-green-400 border border-green-700/50" : "bg-red-900/30 text-red-400 border border-red-700/50"}`}>
                           {p.activo ? "Activo" : "Inactivo"}
                        </span>
                     </td>
                     {showActions && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {onEdit && <button onClick={() => onEdit(p)} className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"><PencilIcon className="h-5 w-5 inline" /></button>}
                           {onDelete && <button onClick={() => onDelete(p.id)} className="text-red-400 hover:text-red-300 transition-colors"><TrashIcon className="h-5 w-5 inline" /></button>}
                        </td>
                     )}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
