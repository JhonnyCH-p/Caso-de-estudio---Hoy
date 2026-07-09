import React from 'react';
import type { Vehiculo } from '../types/vehiculo.types';
import type { PlanFinanciamiento } from '../types/plan.types';
import type { SimulacionResult } from '../types/cotizacion.types';

interface UserData {
   nombre: string;
   cedula: string;
   email: string;
   telefono: string;
   ciudad: string;
}

interface StepConfirmationProps {
   vehiculo: Vehiculo | null;
   plan: PlanFinanciamiento | null;
   simulacion: SimulacionResult | null;
   entrada: string;
   plazoMeses: string;
   userData: UserData | null;
   submitting: boolean;
   onBack: () => void;
   onConfirm: () => void;
}

const formatCurrency = (n: number) => '$' + n.toLocaleString('es-CL');

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
   vehiculo, plan, simulacion, entrada, plazoMeses, userData, submitting, onBack, onConfirm
}) => {
   return (
      <div className="bg-[#0c1322] border border-[#1e2d50] rounded-xl p-6 shadow-lg">
         <h2 className="text-xl font-bold text-white mb-1">Confirmar Cotizacion</h2>
         <p className="text-slate-400 text-xs mb-5">
            Revisa los datos antes de enviar
         </p>

         <div className="space-y-4">
            <div>
               <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Vehiculo</h3>
               <div className="bg-[#0a1225] rounded-lg p-3 border border-[#1e2d50]">
                  <p className="text-white font-semibold">{vehiculo?.marca} {vehiculo?.modelo}</p>
                  <p className="text-slate-400 text-xs">{vehiculo?.anio} - {vehiculo?.tipo}</p>
                  <p className="text-teal-400 font-bold mt-1">{formatCurrency(vehiculo?.precioBase || 0)}</p>
               </div>
            </div>

            <div>
               <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Plan</h3>
               <div className="bg-[#0a1225] rounded-lg p-3 border border-[#1e2d50]">
                  <p className="text-white">{plan?.nombre}</p>
                  <p className="text-slate-400 text-xs">{plan?.tasaInteresAnual}% interes anual</p>
               </div>
            </div>

            <div>
               <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Resumen Financiero</h3>
               <div className="bg-[#0a1225] rounded-lg p-3 border border-[#1e2d50] space-y-1 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-400">Entrada</span>
                     <span className="text-white">{formatCurrency(parseFloat(entrada || '0'))}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Monto Financiado</span>
                     <span className="text-white">{formatCurrency(simulacion?.montoFinanciado || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Plazo</span>
                     <span className="text-white">{plazoMeses} meses</span>
                  </div>
                  <div className="flex justify-between border-t border-[#1e2d50] pt-1 mt-1">
                     <span className="text-slate-200 font-semibold">Cuota Mensual</span>
                     <span className="text-teal-400 font-bold">{formatCurrency(simulacion?.cuotaMensual || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Total Intereses</span>
                     <span className="text-white">{formatCurrency(simulacion?.totalIntereses || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Total Pagado</span>
                     <span className="text-white">{formatCurrency(simulacion?.totalPagado || 0)}</span>
                  </div>
               </div>
            </div>

            <div>
               <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Datos del Cliente</h3>
               <div className="bg-[#0a1225] rounded-lg p-3 border border-[#1e2d50] space-y-1 text-sm">
                  <p><span className="text-slate-400">Nombre:</span> <span className="text-white">{userData?.nombre}</span></p>
                  <p><span className="text-slate-400">Cedula:</span> <span className="text-white">{userData?.cedula}</span></p>
                  <p><span className="text-slate-400">Email:</span> <span className="text-white">{userData?.email}</span></p>
                  <p><span className="text-slate-400">Telefono:</span> <span className="text-white">{userData?.telefono}</span></p>
                  <p><span className="text-slate-400">Ciudad:</span> <span className="text-white">{userData?.ciudad}</span></p>
               </div>
            </div>
         </div>

         <div className="flex gap-3 mt-8">
            <button type="button" onClick={onBack} disabled={submitting}
               className="flex-1 bg-[#111c38] text-slate-300 py-2.5 rounded-lg font-semibold text-sm border border-[#1e2d50] hover:bg-[#1a2848] disabled:opacity-50 transition-colors">
               Atras
            </button>
            <button type="button" onClick={onConfirm} disabled={submitting}
               className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
               {submitting ? 'Enviando...' : 'Confirmar Cotizacion'}
            </button>
         </div>
      </div>
   );
};
