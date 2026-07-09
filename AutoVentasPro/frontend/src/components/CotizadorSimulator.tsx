import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Vehiculo } from '../types/vehiculo.types';
import type { PlanFinanciamiento } from '../types/plan.types';
import type { SimulacionResult } from '../types/cotizacion.types';

interface SimulParams {
   vehiculoId: string;
   planId: string;
   entrada: number;
   plazoMeses: number;
   vehiculo: Vehiculo;
   plan: PlanFinanciamiento;
}

interface CotizadorSimulatorProps {
   onSimulate: (result: SimulacionResult, params: SimulParams) => void;
   initialVehiculoId?: string;
   disabled?: boolean;
}

const TIPO_IMAGE: Record<string, string> = {
   SUV: '/resources/SuvFamiliar.jpg',
   SEDAN: '/resources/SedanEjecutivo.jpg',
   HATCHBACK: '/resources/CompactoUrbano.jpg',
   PICKUP: '/resources/PickUp4x4.jpg',
   DEPORTIVO: '/resources/DeportivoApex.jpg',
   ELECTRICO: '/resources/ElectricoFutureEV.jpg',
   HIBRIDO: '/resources/HibridoEcoCity.jpg',
};

function getVehiculoImage(v: { imagen?: string | null; tipo: string }): string {
   return v.imagen || TIPO_IMAGE[v.tipo] || '/resources/FamiliarProMax.jpeg';
}

export const CotizadorSimulator: React.FC<CotizadorSimulatorProps> = ({ onSimulate, initialVehiculoId, disabled }) => {
   const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
   const [planes, setPlanes] = useState<PlanFinanciamiento[]>([]);
   const [vehiculoId, setVehiculoId] = useState(initialVehiculoId || '');
   const [planId, setPlanId] = useState('');
   const [entrada, setEntrada] = useState('');
   const [plazoMeses, setPlazoMeses] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [resultado, setResultado] = useState<SimulacionResult | null>(null);

   const vehiculoSel = vehiculos.find(v => v.id === vehiculoId);
   const planSel = planes.find(p => p.id === planId);

   useEffect(() => {
      if (initialVehiculoId) setVehiculoId(initialVehiculoId);
   }, [initialVehiculoId]);

   useEffect(() => {
      apiClient.get<{ data: Vehiculo[] }>('/api/vehiculos')
         .then(r => setVehiculos(r.data.data || []))
         .catch(() => setError('Error al cargar vehiculos'));
      apiClient.get<{ data: PlanFinanciamiento[] }>('/api/planes')
         .then(r => setPlanes(r.data.data || []))
         .catch(() => setError('Error al cargar planes'));
   }, []);

   const handleSimular = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setResultado(null);

      if (!vehiculoId || !planId || !plazoMeses) {
         setError('Selecciona vehiculo, plan y plazo'); return;
      }

      setLoading(true);
      try {
         const res = await apiClient.post<{ data: SimulacionResult }>('/api/cotizaciones/simular', {
            vehiculoId,
            planId,
            entrada: parseFloat(entrada) || 0,
            plazoMeses: parseInt(plazoMeses),
         });
         setResultado(res.data.data);
      } catch (err: unknown) {
         const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error al simular';
         setError(msg);
      } finally {
         setLoading(false);
      }
   };

   const entradaMinima = planSel && vehiculoSel
      ? Math.ceil(vehiculoSel.precioBase * (planSel.entradaMinima || 0) / 100)
      : null;

   const formPanel = (
      <div className="bg-[#0c1322] border border-[#1e2d50] rounded-xl p-6 shadow-lg h-fit">
         <h2 className="text-xl font-bold text-white mb-1">Simular Cuota</h2>
         <p className="text-slate-400 text-xs mb-5">Selecciona los parametros para calcular tu cuota mensual</p>

         <form onSubmit={handleSimular} className="space-y-4">
            {vehiculoSel && (
               <div className="bg-[#0a1225] border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
                  <img src={getVehiculoImage(vehiculoSel)} alt={vehiculoSel.modelo}
                     className="w-16 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                     <p className="text-white font-semibold text-sm truncate">{vehiculoSel.marca} {vehiculoSel.modelo}</p>
                     <p className="text-slate-400 text-xs">{vehiculoSel.anio} - {vehiculoSel.tipo}</p>
                     <p className="text-teal-400 font-bold">{'$' + vehiculoSel.precioBase.toLocaleString()}</p>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vehiculo *</label>
                  <select value={vehiculoId} onChange={e => { setVehiculoId(e.target.value); setResultado(null); }}
                     disabled={disabled}
                     className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50">
                     <option value="" className="bg-[#0c1322]">Seleccione</option>
                     {vehiculos.map(v => (
                        <option key={v.id} value={v.id} className="bg-[#0c1322]">
                           {v.marca} {v.modelo} ({v.anio})
                        </option>
                     ))}
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Plan *</label>
                  <select value={planId} onChange={e => { setPlanId(e.target.value); setPlazoMeses(''); setResultado(null); }}
                     disabled={disabled}
                     className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50">
                     <option value="" className="bg-[#0c1322]">Seleccione</option>
                     {planes.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#0c1322]">{p.nombre} ({p.tasaInteresAnual}%)</option>
                     ))}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                     Entrada ($)
                     {entradaMinima !== null && <span className="text-slate-500 lowercase font-normal"> min </span>}
                  </label>
                  <input type="number" value={entrada} onChange={e => { setEntrada(e.target.value); setResultado(null); }}
                     min={0} step={100} placeholder={entradaMinima ? ('Min $' + entradaMinima) : 'Ej: 5000'}
                     disabled={disabled}
                     className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50" />
               </div>
               <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Plazo *</label>
                  <select value={plazoMeses} onChange={e => { setPlazoMeses(e.target.value); setResultado(null); }}
                     disabled={disabled || !planSel}
                     className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50">
                     <option value="" className="bg-[#0c1322]">{planSel ? 'Seleccione' : 'Primero el plan'}</option>
                     {planSel?.plazosDisponibles?.map(m => (
                        <option key={m} value={m} className="bg-[#0c1322]">{m} meses</option>
                     ))}
                  </select>
               </div>
            </div>

            {error && (
               <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-400">{error}</div>
            )}

            {!resultado ? (
               <button type="submit" disabled={loading || disabled}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {loading ? 'Calculando...' : 'Simular Cuota'}
               </button>
            ) : (
               <button type="button" onClick={() => {
                  if (!vehiculoSel || !planSel) return;
                  onSimulate(resultado, {
                     vehiculoId, planId,
                     entrada: parseFloat(entrada) || 0,
                     plazoMeses: parseInt(plazoMeses),
                     vehiculo: vehiculoSel,
                     plan: planSel,
                  });
               }}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
                  Continuar
               </button>
            )}
         </form>
      </div>
   );

   const resultPanel = resultado ? (
      <div className="bg-[#0c1322] border border-[#1e2d50] rounded-xl p-6 shadow-lg h-fit lg:sticky lg:top-6">
         <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>✓</span> Simulacion
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex justify-between py-1.5 border-b border-blue-900/30 col-span-1">
               <span className="text-slate-400">Precio Vehiculo</span>
               <span className="text-white font-semibold">{'$' + (vehiculoSel?.precioBase || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-blue-900/30">
               <span className="text-slate-400">Entrada</span>
               <span className="text-white font-semibold">{'$' + parseFloat(entrada || '0').toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-blue-900/30">
               <span className="text-slate-400">Monto a Financiar</span>
               <span className="text-white font-semibold">{'$' + resultado.montoFinanciado.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-blue-900/30">
               <span className="text-slate-400">Plazo</span>
               <span className="text-white font-semibold">{plazoMeses} meses</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-blue-900/30">
               <span className="text-slate-400">Tasa Interes</span>
               <span className="text-white font-semibold">{planSel?.tasaInteresAnual || '—'}% anual</span>
            </div>
            <div className="col-span-1 sm:col-span-2 bg-blue-900/30 rounded-lg p-3 flex justify-between items-center mt-1">
               <span className="text-slate-200 font-semibold text-sm">Cuota Mensual</span>
               <span className="text-teal-400 font-bold text-xl">{'$' + resultado.cuotaMensual.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5">
               <span className="text-slate-400">Total Intereses</span>
               <span className="text-white font-semibold">{'$' + resultado.totalIntereses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5">
               <span className="text-slate-400">Total Pagado</span>
               <span className="text-white font-semibold">{'$' + resultado.totalPagado.toLocaleString()}</span>
            </div>
         </div>
         {resultado.tablaAmortizacion.length > 0 && (
            <div className="mt-4">
               <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Tabla de Amortizacion</p>
               <div className="max-h-72 overflow-y-auto rounded-lg border border-blue-900/30">
                  <table className="w-full text-xs border-collapse">
                     <thead className="bg-blue-900/40 sticky top-0">
                        <tr><th className="p-1.5 text-slate-300 font-semibold">#</th><th className="p-1.5 text-slate-300 font-semibold">Capital</th><th className="p-1.5 text-slate-300 font-semibold">Interes</th><th className="p-1.5 text-slate-300 font-semibold">Saldo</th></tr>
                     </thead>
                     <tbody>
                        {resultado.tablaAmortizacion.map((f, i) => (
                           <tr key={i} className="border-b border-blue-900/20 hover:bg-blue-900/20 transition-colors">
                              <td className="p-1.5 text-center text-slate-400">{f.cuota}</td>
                              <td className="p-1.5 text-right text-slate-300">{'$' + f.capital.toLocaleString()}</td>
                              <td className="p-1.5 text-right text-slate-300">{'$' + f.interes.toLocaleString()}</td>
                              <td className="p-1.5 text-right text-slate-300">{'$' + f.saldo.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   ) : null;

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
         {formPanel}
         {resultado ? resultPanel : (
            <div className="bg-[#0c1322] border border-[#1e2d50] border-dashed rounded-xl p-6 h-fit lg:sticky lg:top-6 flex flex-col items-center justify-center text-center min-h-[300px]">
               <span className="text-4xl mb-3">📊</span>
               <p className="text-slate-500 font-medium">Resultado de la simulacion</p>
               <p className="text-slate-600 text-sm mt-1">Completa el formulario y presiona "Simular Cuota"</p>
            </div>
         )}
      </div>
   );
};
