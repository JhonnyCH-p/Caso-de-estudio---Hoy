import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Venta } from "../types/venta.types";

interface VentaListProps {
   ventas: Venta[];
   loading: boolean;
   error: string | null;
   onAprobar?: (v: Venta) => void;
   onDelete?: (id: string) => void;
}

const ESTADO_BADGE: Record<string, string> = {
   PENDIENTE: "bg-yellow-100 text-yellow-800",
   APROBADA: "bg-green-100 text-green-800",
   RECHAZADA: "bg-red-100 text-red-800",
   CANCELADA: "bg-gray-100 text-gray-800",
};

const ESTADO_BADGE_DARK: Record<string, string> = {
   PENDIENTE: "bg-yellow-900/50 text-yellow-300",
   APROBADA: "bg-green-900/50 text-green-300",
   RECHAZADA: "bg-red-900/50 text-red-300",
   CANCELADA: "bg-slate-700/50 text-slate-300",
};

export const VentaList: React.FC<VentaListProps> = ({ ventas, loading, error, onAprobar, onDelete }) => {
   if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
   if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">❌ Error: {error}</div>;
   if (ventas.length === 0) return <div className="text-center py-12 bg-[#0c1322] border border-[#1e2d50] rounded-lg"><p className="text-slate-400 text-lg">No hay ventas registradas</p></div>;

   const showActions = !!(onAprobar || onDelete);

   return (
      <div className="overflow-x-auto shadow-md rounded-lg border border-[#1e2d50]">
         <table className="min-w-full bg-[#0c1322]">
            <thead className="bg-[#111c38] border-b border-[#1e2d50]">
               <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Cotización</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Asesor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Valor Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                  {showActions && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>}
               </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d50]">
               {ventas.map((v, i) => (
                  <tr key={v.id} className="hover:bg-[#111c38] transition-colors">
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{i + 1}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.cotizacionId.slice(0, 8)}...</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.asesorId.slice(0, 8)}...</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300 font-semibold">${v.valorTotal.toLocaleString()}</td>
                     <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE_DARK[v.estado] || "bg-slate-700/50 text-slate-300"}`}>
                           {v.estado}
                        </span>
                     </td>
                     {showActions && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {onAprobar && v.estado === "PENDIENTE" && (
                              <button onClick={() => onAprobar(v)} className="text-green-400 hover:text-green-300 mr-2 transition-colors" title="Aprobar">✅</button>
                           )}
                           {onDelete && (
                              <button onClick={() => onDelete(v.id)} className="text-red-400 hover:text-red-300 transition-colors"><TrashIcon className="h-5 w-5 inline" /></button>
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
