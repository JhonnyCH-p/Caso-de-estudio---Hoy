import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Vehiculo } from "../types/vehiculo.types";

interface VehiculoListProps {
   vehiculos: Vehiculo[];
   loading: boolean;
   error: string | null;
   onEdit?: (v: Vehiculo) => void;
   onDelete?: (id: string) => void;
   onAdjustStock?: (id: string) => void;
}

export const VehiculoList: React.FC<VehiculoListProps> = ({ vehiculos, loading, error, onEdit, onDelete, onAdjustStock }) => {
   if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
   if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">❌ Error: {error}</div>;
   if (vehiculos.length === 0) return <div className="text-center py-12 bg-[#0c1322] border border-[#1e2d50] rounded-lg"><p className="text-slate-400 text-lg">No hay vehículos registrados</p></div>;

   const showActions = !!(onEdit || onDelete || onAdjustStock);

   return (
      <div className="overflow-x-auto shadow-md rounded-lg border border-[#1e2d50]">
         <table className="min-w-full bg-[#0c1322]">
            <thead className="bg-[#111c38] border-b border-[#1e2d50]">
                <tr>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">#</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Imagen</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Marca</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Modelo</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Año</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Precio Base</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tipo</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Stock</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                  {showActions && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d50]">
               {vehiculos.map((v, i) => (
                   <tr key={v.id} className="hover:bg-[#111c38] transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{i + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                         <img src={v.imagen || '/resources/FamiliarProMax.jpeg'} alt={v.modelo}
                            className="w-14 h-10 object-cover rounded border border-[#1e2d50]" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.marca}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{v.modelo}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.anio}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">${v.precioBase.toLocaleString()}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.tipo}</td>
                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{v.stock}</td>
                     <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.activo ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                           {v.activo ? "Activo" : "Inactivo"}
                        </span>
                     </td>
                     {showActions && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                           {onEdit && <button onClick={() => onEdit(v)} className="text-blue-400 hover:text-blue-300 mr-2 transition-colors"><PencilIcon className="h-5 w-5 inline" /></button>}
                           {onAdjustStock && <button onClick={() => onAdjustStock(v.id)} className="text-green-400 hover:text-green-300 mr-2 transition-colors" title="Ajustar stock">📦</button>}
                           {onDelete && <button onClick={() => onDelete(v.id)} className="text-red-400 hover:text-red-300 transition-colors"><TrashIcon className="h-5 w-5 inline" /></button>}
                        </td>
                     )}
                   </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
