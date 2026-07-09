import React, { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import type { Vehiculo } from "../types/vehiculo.types";
import type { PlanFinanciamiento } from "../types/plan.types";

interface CotizacionFormProps {
   isSubmitting: boolean;
   onSubmit: (data: {
      vehiculoId: string;
      planId: string;
      clienteNombre: string;
      clienteEmail: string;
      clienteTelefono: string;
      entrada: number;
      plazoMeses: number;
   }) => Promise<void>;
   onCancel: () => void;
   initialVehiculoId?: string;
   result?: {
      cuotaMensual: number;
      montoFinanciado: number;
      totalIntereses: number;
      totalPagado: number;
      tablaAmortizacion: { cuota: number; capital: number; interes: number; saldo: number }[];
   } | null;
}

export const CotizacionForm: React.FC<CotizacionFormProps> = ({ isSubmitting, onSubmit, onCancel, initialVehiculoId, result }) => {
   const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
   const [planes, setPlanes] = useState<PlanFinanciamiento[]>([]);
   const [vehiculoId, setVehiculoId] = useState(initialVehiculoId || "");
   const [planId, setPlanId] = useState("");
   const [entrada, setEntrada] = useState("");
   const [plazoMeses, setPlazoMeses] = useState("");
   const [clienteNombre, setClienteNombre] = useState("");
   const [clienteEmail, setClienteEmail] = useState("");
   const [clienteTelefono, setClienteTelefono] = useState("");
   const [error, setError] = useState("");

   const planActual = planes.find(p => p.id === planId);

   useEffect(() => {
      if (initialVehiculoId) setVehiculoId(initialVehiculoId);
   }, [initialVehiculoId]);

   useEffect(() => {
      Promise.all([
         apiClient.get<{ data: Vehiculo[] }>("/api/vehiculos"),
         apiClient.get<{ data: PlanFinanciamiento[] }>("/api/planes"),
      ]).then(([vRes, pRes]) => {
         setVehiculos(vRes.data.data || []);
         setPlanes(pRes.data.data || []);
      }).catch(() => setError("Error al cargar datos"));
   }, []);

   const vehiculoSeleccionado = vehiculos.find(v => v.id === vehiculoId);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      if (!vehiculoId || !planId || !plazoMeses || !clienteNombre) {
         setError("Complete los campos requeridos"); return;
      }
      await onSubmit({
         vehiculoId, planId, clienteNombre,
         clienteEmail: clienteEmail || "cliente@email.com",
         clienteTelefono: clienteTelefono || "0999999999",
         entrada: parseFloat(entrada) || 0,
         plazoMeses: parseInt(plazoMeses),
      });
   };

   return (
      <div className="space-y-6">
         {vehiculoSeleccionado && (
            <div className="bg-[#0a1225] border border-blue-500/20 rounded-lg p-4 flex items-center gap-4">
               <img src={vehiculoSeleccionado.tipo === 'SUV' ? '/resources/SuvFamiliar.jpg' :
                  vehiculoSeleccionado.tipo === 'SEDAN' ? '/resources/SedanEjecutivo.jpg' :
                  vehiculoSeleccionado.tipo === 'HATCHBACK' ? '/resources/CompactoUrbano.jpg' :
                  vehiculoSeleccionado.tipo === 'PICKUP' ? '/resources/PickUp4x4.jpg' :
                  vehiculoSeleccionado.tipo === 'DEPORTIVO' ? '/resources/DeportivoApex.jpg' :
                  vehiculoSeleccionado.tipo === 'ELÉCTRICO' ? '/resources/ElectricoFutureEV.jpg' :
                  vehiculoSeleccionado.tipo === 'HÍBRIDO' ? '/resources/HibridoEcoCity.jpg' :
                  '/resources/FamiliarProMax.jpeg'}
                  alt={vehiculoSeleccionado.modelo} className="w-16 h-16 object-cover rounded-lg" />
               <div>
                  <p className="text-white font-semibold text-sm">{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}</p>
                  <p className="text-slate-400 text-xs">{vehiculoSeleccionado.anio} · {vehiculoSeleccionado.tipo}</p>
                  <p className="text-teal-400 font-bold text-sm mt-0.5">${vehiculoSeleccionado.precioBase.toLocaleString()}</p>
               </div>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300">Vehículo *</label>
                  <select value={vehiculoId} onChange={e => setVehiculoId(e.target.value)}
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting || !!initialVehiculoId}>
                     <option value="" className="bg-[#0c1322]">Seleccione</option>
                     {vehiculos.map(v => <option key={v.id} value={v.id} className="bg-[#0c1322]">{v.marca} {v.modelo} ({v.anio}) - ${v.precioBase.toLocaleString()}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Plan Financiero *</label>
                  <select value={planId} onChange={e => { setPlanId(e.target.value); setPlazoMeses(""); }}
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting}>
                     <option value="" className="bg-[#0c1322]">Seleccione</option>
                     {planes.map(p => <option key={p.id} value={p.id} className="bg-[#0c1322]">{p.nombre} ({p.tasaInteresAnual}%)</option>)}
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300">Entrada ($)</label>
                  <input type="number" value={entrada} onChange={e => setEntrada(e.target.value)} min={0} placeholder="Ej: 5000"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Plazo (meses) *</label>
                  <select value={plazoMeses} onChange={e => setPlazoMeses(e.target.value)}
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting || !planActual}>
                     <option value="" className="bg-[#0c1322]">{planActual ? "Seleccione plazo" : "Seleccione un plan primero"}</option>
                     {planActual?.plazosDisponibles?.map(m => <option key={m} value={m} className="bg-[#0c1322]">{m} meses</option>)}
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-300">Cliente *</label>
                  <input type="text" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} placeholder="Nombre"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Email</label>
                  <input type="email" value={clienteEmail} onChange={e => setClienteEmail(e.target.value)} placeholder="email@ejemplo.com"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300">Teléfono</label>
                  <input type="tel" value={clienteTelefono} onChange={e => setClienteTelefono(e.target.value)} placeholder="0999999999"
                     className="mt-1 block w-full rounded-md bg-[#0a1225] border-[#1e2d50] text-slate-300 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     disabled={isSubmitting} />
               </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2d50]">
               <button type="button" onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#111c38] rounded-md hover:bg-[#1a2848] border border-[#1e2d50] transition-colors"
                  disabled={isSubmitting}>Cancelar</button>
               <button type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}>{isSubmitting ? "Calculando..." : "Simular Cotización"}</button>
            </div>
         </form>

         {result && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5">
               <h4 className="font-semibold text-blue-300 mb-3">Resultado de la Simulación</h4>
               <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Monto a Financiar:</span><span className="font-semibold text-white">${result.montoFinanciado.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Cuota Mensual:</span><span className="font-semibold text-teal-400 text-lg">${result.cuotaMensual.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Intereses:</span><span className="font-semibold text-white">${result.totalIntereses.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Pagado:</span><span className="font-semibold text-white">${result.totalPagado.toFixed(2)}</span></div>
               </div>
               {result.tablaAmortizacion && result.tablaAmortizacion.length > 0 && (
                  <div className="mt-3 max-h-48 overflow-y-auto">
                     <table className="w-full text-xs border-collapse">
                        <thead><tr className="bg-blue-900/40"><th className="p-1.5 text-slate-300">#</th><th className="p-1.5 text-slate-300">Capital</th><th className="p-1.5 text-slate-300">Interés</th><th className="p-1.5 text-slate-300">Saldo</th></tr></thead>
                        <tbody>
                           {result.tablaAmortizacion.map((f, i) => (
                              <tr key={i} className="border-b border-blue-900/30"><td className="p-1.5 text-center text-slate-400">{f.cuota}</td><td className="p-1.5 text-right text-slate-300">${f.capital.toFixed(2)}</td><td className="p-1.5 text-right text-slate-300">${f.interes.toFixed(2)}</td><td className="p-1.5 text-right text-slate-300">${f.saldo.toFixed(2)}</td></tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};
