import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Cotizacion } from "../types/cotizacion.types";

interface CotizacionListProps {
   cotizaciones: Cotizacion[];
   loading: boolean;
   error: string | null;
   onViewDetail: (c: Cotizacion) => void;
   onAprobar?: (c: Cotizacion) => void;
   onDelete?: (id: string) => void;
}

const ESTADO_BADGE: Record<string, string> = {
   PENDIENTE: "bg-yellow-900/30 text-yellow-400 border border-yellow-700/50",
   APROBADA: "bg-green-900/30 text-green-400 border border-green-700/50",
   RECHAZADA: "bg-red-900/30 text-red-400 border border-red-700/50",
   EXPIRADA: "bg-slate-700/30 text-slate-400 border border-slate-600/50",
};

export const CotizacionList: React.FC<CotizacionListProps> = ({ cotizaciones, loading, error, onViewDetail, onAprobar, onDelete }) => {
   if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
   if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">❌ Error: {error}</div>;
   if (cotizaciones.length === 0) return <div className="text-center py-12 bg-[#0c1322] rounded-lg"><p className="text-slate-400 text-lg">No hay cotizaciones</p></div>;

   const showActions = !!(onAprobar || onDelete);

   return (
      <div className="overflow-x-auto rounded-lg border border-[#1e2d50]">
         <table className="min-w-full bg-[#0c1322]">
            <thead className="bg-[#111c38] border-b border-[#1e2d50]">
               <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Monto Financiado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plazo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cuota Mensual</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                  {showActions && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>}
               </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d50]">
               {cotizaciones.map((c, i) => (
                  <tr key={c.id} className="hover:bg-[#111c38] transition-colors cursor-pointer" onClick={() => onViewDetail(c)}>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{i + 1}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{c.clienteNombre}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">${c.montoFinanciado.toLocaleString()}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{c.plazoMeses} meses</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300 font-semibold">${c.cuotaMensual.toFixed(2)}</td>
                     <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[c.estado] || "bg-slate-800/30 text-slate-400 border border-slate-600/50"}`}>
                           {c.estado}
                        </span>
                     </td>
                     {showActions && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                           {onAprobar && c.estado === "PENDIENTE" && (
                              <button onClick={() => onAprobar(c)} className="text-green-400 hover:text-green-300 mr-2 transition-colors" title="Aprobar">✅</button>
                           )}
                           {onDelete && (
                              <button onClick={() => onDelete(c.id)} className="text-red-400 hover:text-red-300 transition-colors"><TrashIcon className="h-5 w-5 inline" /></button>
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
