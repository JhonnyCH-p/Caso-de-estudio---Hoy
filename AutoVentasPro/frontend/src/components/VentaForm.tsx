import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import type { Cotizacion } from "../types/cotizacion.types";
import type { Employee } from "../types/employee.types";

interface VentaFormProps {
   isSubmitting: boolean;
   cotizacionPreSeleccionada?: string;
   onSubmit: (data: { cotizacionId: string; asesorId: string; valorTotal: number }) => Promise<void>;
   onCancel: () => void;
}

export const VentaForm: React.FC<VentaFormProps> = ({ isSubmitting, cotizacionPreSeleccionada, onSubmit, onCancel }) => {
   const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
   const [asesores, setAsesores] = useState<Employee[]>([]);
   const [cotizacionId, setCotizacionId] = useState(cotizacionPreSeleccionada || "");
   const [asesorId, setAsesorId] = useState("");
   const [valorTotal, setValorTotal] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
      Promise.all([
         apiClient.get<{ data: Cotizacion[] }>("/api/cotizaciones"),
         apiClient.get<{ data: Employee[] }>("/api/employees"),
      ]).then(([cRes, aRes]) => {
         const aprobadas = (cRes.data.data || []).filter((c: Cotizacion) => c.estado === "APROBADA");
         setCotizaciones(aprobadas);
         setAsesores(aRes.data.data || []);
      }).catch(() => setError("Error al cargar datos"));
   }, []);

   useEffect(() => {
      if (cotizacionPreSeleccionada) setCotizacionId(cotizacionPreSeleccionada);
   }, [cotizacionPreSeleccionada]);

   const cotizacionSeleccionada = cotizaciones.find(c => c.id === cotizacionId);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      if (!cotizacionId || !asesorId || !valorTotal) {
         setError("Complete todos los campos"); return;
      }
      await onSubmit({ cotizacionId, asesorId: asesorId, valorTotal: parseFloat(valorTotal) });
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-300">Cotización Aprobada *</label>
            <select value={cotizacionId} onChange={e => { setCotizacionId(e.target.value); if (e.target.value) { const c = cotizaciones.find(cc => cc.id === e.target.value); if (c) setValorTotal(c.totalPagado.toString()); } }}
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting || !!cotizacionPreSeleccionada}>
               <option value="" className="bg-[#0c1322]">Seleccione cotización</option>
               {cotizaciones.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0c1322]">
                     {c.clienteNombre} - ${c.totalPagado.toFixed(2)} ({c.id.slice(0, 8)}...)
                  </option>
               ))}
            </select>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Asesor *</label>
            <select value={asesorId} onChange={e => setAsesorId(e.target.value)}
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting}>
               <option value="" className="bg-[#0c1322]">Seleccione asesor</option>
               {asesores.filter(a => a.activo).map(a => (
                  <option key={a.id} value={a.id} className="bg-[#0c1322]">{a.nombres}</option>
               ))}
            </select>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300">Valor Total *</label>
            <input type="number" value={valorTotal} onChange={e => setValorTotal(e.target.value)} min={0} step="0.01"
               className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
               disabled={isSubmitting} />
            {cotizacionSeleccionada && (
               <p className="mt-1 text-xs text-slate-500">Total según cotización: ${cotizacionSeleccionada.totalPagado.toFixed(2)}</p>
            )}
         </div>
         {error && <p className="text-sm text-red-400">{error}</p>}
         <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2d50]">
            <button type="button" onClick={onCancel}
               className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#0a1225] border border-[#1e2d50] rounded-md hover:bg-[#111c38] transition-colors"
               disabled={isSubmitting}>Cancelar</button>
            <button type="submit"
               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
               disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Registrar Venta"}</button>
         </div>
      </form>
   );
};
