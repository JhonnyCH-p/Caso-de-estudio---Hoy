import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehiculo } from '../types/vehiculo.types';

const TIPO_IMAGE: Record<string, string> = {
   SUV: '/resources/SuvFamiliar.jpg',
   SEDAN: '/resources/SedanEjecutivo.jpg',
   HATCHBACK: '/resources/CompactoUrbano.jpg',
   PICKUP: '/resources/PickUp4x4.jpg',
   DEPORTIVO: '/resources/DeportivoApex.jpg',
   ELÉCTRICO: '/resources/ElectricoFutureEV.jpg',
   HÍBRIDO: '/resources/HibridoEcoCity.jpg',
};

function parseEspecificaciones(esp: string): Record<string, string> {
   try { const parsed = JSON.parse(esp); return typeof parsed === 'object' && parsed !== null ? parsed : {}; }
   catch { return {}; }
}

function specIcon(key: string): string {
   const map: Record<string, string> = { motor: '⚙️', transmision: '🕹️', traccion: '🛞', batería: '🔋', combustible: '⛽', color: '🎨' };
   return map[key.toLowerCase()] || '🔧';
}

interface VehicleDetailModalProps {
   vehiculo: Vehiculo;
   onClose: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehiculo, onClose }) => {
   const navigate = useNavigate();
   const specs = parseEspecificaciones(vehiculo.especificaciones);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
         <div className="bg-[#0c1322] border border-[#1e2d50] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
                <img src={vehiculo.imagen || TIPO_IMAGE[vehiculo.tipo] || '/resources/FamiliarProMax.jpeg'} alt={vehiculo.marca + ' ' + vehiculo.modelo}
                  className="w-full h-[300px] object-cover rounded-t-2xl" />
               <button onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
               {vehiculo.stock === 0 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">Agotado</span>
               )}
            </div>

            <div className="p-8 space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                     <h2 className="text-2xl font-bold text-white">{vehiculo.marca} {vehiculo.modelo}</h2>
                     <p className="text-slate-400 text-sm mt-1">{vehiculo.anio} · {vehiculo.tipo}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-3xl font-bold text-teal-400"></p>
                     <p className="text-xs text-slate-500 mt-1">Stock: {vehiculo.stock} unidades</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(specs).filter(([k]) => k !== 'color').map(([k, val]) => (
                     <div key={k} className="bg-[#0a1225] border border-[#1a2848] rounded-lg p-3 text-center">
                        <span className="text-lg">{specIcon(k)}</span>
                        <p className="text-xs text-slate-500 mt-1 capitalize">{k}</p>
                        <p className="text-sm text-white font-medium">{String(val)}</p>
                     </div>
                  ))}
                  <div className="bg-[#0a1225] border border-[#1a2848] rounded-lg p-3 text-center">
                     <span className="text-lg">📦</span>
                     <p className="text-xs text-slate-500 mt-1 capitalize">Stock</p>
                     <p className="text-sm text-white font-medium">{vehiculo.stock} unid.</p>
                  </div>
               </div>

               {specs.color && (
                  <div className="flex items-center gap-2 text-sm">
                     <span className="text-slate-500">Color:</span>
                     <span className="w-5 h-5 rounded-full border border-slate-600" style={{ backgroundColor: specs.color.toLowerCase() }} />
                     <span className="text-white">{specs.color}</span>
                  </div>
               )}

               <div className="flex gap-3 pt-4 border-t border-[#1e2d50]">
                   <button onClick={() => { onClose(); navigate('/cotizaciones?vehiculoId=' + vehiculo.id); }}
                     disabled={vehiculo.stock === 0}
                     className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                     {vehiculo.stock === 0 ? 'No disponible' : 'Cotizar este vehículo'}
                  </button>
                  <button onClick={onClose}
                     className="px-6 bg-[#111c38] text-slate-300 py-3 rounded-lg font-semibold text-sm border border-[#1e2d50] hover:bg-[#1a2848] transition-colors">
                     Cerrar
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};