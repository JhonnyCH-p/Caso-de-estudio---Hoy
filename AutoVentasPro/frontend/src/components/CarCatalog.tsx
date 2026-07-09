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

const TIPO_CATEGORY: Record<string, string> = {
   SUV: 'SUV | Confort',
   SEDAN: 'Sedán | Ejecutivo',
   HATCHBACK: 'Hatchback | City',
   PICKUP: 'Camioneta | Heavy Duty',
   DEPORTIVO: 'Coupé | Sport',
   ELÉCTRICO: 'Crossover | 100% Eléctrico',
   HÍBRIDO: 'Hatchback | Smart Eco',
};

function parseEspecificaciones(esp: string): Record<string, string> {
   try {
      const parsed = JSON.parse(esp);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
   } catch {
      return {};
   }
}

function specIcon(key: string): string {
   const map: Record<string, string> = { motor: '⚙️', transmision: '🕹️', traccion: '🛞', batería: '🔋', combustible: '⛽', color: '🎨' };
   return map[key.toLowerCase()] || '🔧';
}

interface CarCatalogProps {
   vehiculos: Vehiculo[];
   loading: boolean;
}

export const CarCatalog: React.FC<CarCatalogProps> = ({ vehiculos, loading }) => {
   const navigate = useNavigate();

   if (loading) {
      return (
         <section className="bg-[#0c1322] py-16 px-10">
            <h2 className="text-center text-3xl font-bold text-white mb-3">Catálogo Destacado</h2>
            <p className="text-center text-slate-400 max-w-[650px] mx-auto mb-10">
               Explora nuestra selección de vehículos nuevos con financiamiento flexible y tasas preferenciales.
            </p>
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
         </section>
      );
   }

   if (vehiculos.length === 0) return null;

   return (
      <section className="bg-[#0c1322] py-16 px-10">
         <h2 className="text-center text-3xl font-bold text-white mb-3">Catálogo Destacado</h2>
         <p className="text-center text-slate-400 max-w-[650px] mx-auto mb-10">
            Explora nuestra selección de vehículos nuevos con financiamiento flexible y tasas preferenciales.
         </p>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {vehiculos.map(v => {
               const specs = parseEspecificaciones(v.especificaciones);
               const specEntries = Object.entries(specs).filter(([k]) => k !== 'color' && k !== 'combustible').slice(0, 2);
               return (
                  <div key={v.id} className="bg-[#111c38] border border-[#1e2d50] rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1.5 transition-all">
                     <div className="relative h-[200px] bg-slate-800">
                         <img src={v.imagen || TIPO_IMAGE[v.tipo] || '/resources/FamiliarProMax.jpeg'} alt={v.modelo} className="w-full h-full object-cover" />
                        {v.stock <= 2 && (
                           <span className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded ${v.stock === 0 ? 'bg-red-600' : 'bg-teal-700'}`}>
                              {v.stock === 0 ? 'Agotado' : 'Pocas unidades'}
                           </span>
                        )}
                     </div>
                     <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-baseline gap-3">
                           <h3 className="text-white text-xl font-bold">{v.marca} {v.modelo}</h3>
                           <p className="text-teal-400 text-xl font-bold">${v.precioBase.toLocaleString()}</p>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 mb-4">{TIPO_CATEGORY[v.tipo] || v.tipo}</p>
                        <div className="flex flex-wrap gap-3 mb-6 bg-[#0a1225] p-3 rounded-lg border border-[#1a2848]">
                           {specEntries.map(([k, val]) => (
                              <span key={k} className="text-sm text-slate-300 font-medium flex items-center gap-1">
                                 {specIcon(k)} {k}: {val}
                              </span>
                           ))}
                           <span className="text-sm text-slate-300 font-medium flex items-center gap-1">📦 Stock: {v.stock}</span>
                        </div>
                        <div className="flex gap-3 mt-auto">
                           <button onClick={() => navigate('/vehiculos')}
                              className="flex-1 text-center bg-transparent text-blue-400 py-2.5 rounded-lg font-semibold text-sm border border-blue-500 hover:bg-blue-500/10 transition-colors">
                              Detalles
                           </button>
                           <button onClick={() => navigate('/cotizaciones')}
                              className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                              Cotizar
                           </button>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>
   );
};
