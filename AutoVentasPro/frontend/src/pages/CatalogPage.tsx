import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehiculoAPI } from '../api/vehiculo.api';
import { CatalogFilters } from '../components/CatalogFilters';
import { VehicleDetailModal } from '../components/VehicleDetailModal';
import type { Vehiculo } from '../types/vehiculo.types';

const TIPO_IMAGE: Record<string, string> = {
   SUV: '/resources/SuvFamiliar.jpg',
   SEDAN: '/resources/SedanEjecutivo.jpg',
   HATCHBACK: '/resources/CompactoUrbano.jpg',
   PICKUP: '/resources/PickUp4x4.jpg',
   DEPORTIVO: '/resources/DeportivoApex.jpg',
   ELECTRICO: '/resources/ElectricoFutureEV.jpg',
   HIBRIDO: '/resources/HibridoEcoCity.jpg',
};

const TIPO_CATEGORY: Record<string, string> = {
   SUV: 'SUV | Confort', SEDAN: 'Sedan | Ejecutivo', HATCHBACK: 'Hatchback | City',
   PICKUP: 'Camioneta | Heavy Duty', DEPORTIVO: 'Coupe | Sport',
   ELECTRICO: 'Crossover | 100% Electrico', HIBRIDO: 'Hatchback | Smart Eco',
};

function parseEspecificaciones(esp: string): Record<string, string> {
   try { const parsed = JSON.parse(esp); return typeof parsed === 'object' && parsed !== null ? parsed : {}; }
   catch { return {}; }
}

function specIcon(key: string): string {
   const map: Record<string, string> = { motor: 'MG', transmision: 'TM', traccion: 'TR', bateria: 'BT', combustible: 'CM', color: 'CL' };
   return map[key.toLowerCase()] || 'FX';
}

export const CatalogPage: React.FC = () => {
   const navigate = useNavigate();
   const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [search, setSearch] = useState('');
   const [tipoFiltro, setTipoFiltro] = useState('');
   const [minPrice, setMinPrice] = useState('');
   const [maxPrice, setMaxPrice] = useState('');
   const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);

   useEffect(() => {
      VehiculoAPI.getAll()
         .then(data => setVehiculos(data.filter(v => v.activo)))
         .catch(() => setError('Error al cargar vehiculos'))
         .finally(() => setLoading(false));
   }, []);

   const filtered = vehiculos.filter(v => {
      if (search) {
         const s = search.toLowerCase();
         if (!v.marca.toLowerCase().includes(s) && !v.modelo.toLowerCase().includes(s)) return false;
      }
      if (tipoFiltro && v.tipo !== tipoFiltro) return false;
      if (minPrice && v.precioBase < parseFloat(minPrice)) return false;
      if (maxPrice && v.precioBase > parseFloat(maxPrice)) return false;
      return true;
   });

   return (
      <div className="min-h-screen bg-[#080e1a]">
         <div className="relative h-[280px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-[#080e1a]" />
            <div className="absolute inset-0 bg-[url('/resources/slider1.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
            <div className="relative z-[1] text-center px-6">
               <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Catalogo de Vehiculos</h1>
               <p className="text-lg text-slate-400 max-w-[600px] mx-auto">
                  Explora nuestra gama completa de vehiculos nuevos. Filtra por tipo, precio y encuentra el auto ideal para ti.
               </p>
            </div>
         </div>

         <div className="flex justify-center mb-2 mt-[-10px]">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5">
               <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
               <span className="text-blue-300 text-xs font-medium">Elegir Vehiculo</span>
               <span className="text-slate-500 text-[10px]">Paso actual</span>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-10 pb-16">
            <div className="flex flex-col lg:flex-row gap-8">
               <aside className="lg:w-[280px] shrink-0">
                  <div className="bg-[#0c1322] border border-[#1e2d50] rounded-xl p-5 sticky top-6">
                     <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtros
                     </h3>
                     <CatalogFilters
                        search={search} setSearch={setSearch}
                        tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro}
                        minPrice={minPrice} setMinPrice={setMinPrice}
                        maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
                  </div>
               </aside>

               <div className="flex-1">
                  {loading ? (
                     <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                     </div>
                  ) : error ? (
                     <div className="text-center py-20">
                        <p className="text-red-400">{error}</p>
                        <button onClick={() => window.location.reload()}
                           className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Reintentar</button>
                     </div>
                  ) : filtered.length === 0 ? (
                     <div className="text-center py-20">
                        <p className="text-slate-500 text-lg mb-2">No se encontraron vehiculos</p>
                        <p className="text-slate-600 text-sm">Intenta ajustar los filtros de busqueda</p>
                     </div>
                  ) : (
                     <>
                        <p className="text-sm text-slate-500 mb-6">
                           Mostrando {filtered.length} de {vehiculos.length} vehiculos
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                           {filtered.map(v => {
                              const specs = parseEspecificaciones(v.especificaciones);
                              const specEntries = Object.entries(specs).filter(([k]) => k !== 'color' && k !== 'combustible').slice(0, 2);
                              return (
                                 <div key={v.id}
                                    className="bg-[#0c1322] border border-[#1e2d50] rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1.5 hover:border-blue-500/30 transition-all cursor-pointer group"
                                    onClick={() => setSelectedVehiculo(v)}>
                                    <div className="relative h-[200px] bg-slate-800 overflow-hidden">
                                        <img src={v.imagen || TIPO_IMAGE[v.tipo] || '/resources/FamiliarProMax.jpeg'} alt={v.modelo}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                       <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322]/60 to-transparent" />
                                       {v.stock <= 2 && (
                                          <span className={'absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded ' + (v.stock === 0 ? 'bg-red-600' : 'bg-teal-700')}>
                                             {v.stock === 0 ? 'Agotado' : 'Pocas unidades'}
                                          </span>
                                       )}
                                       <span className="absolute bottom-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded">
                                          {v.tipo}
                                       </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                       <div className="flex justify-between items-baseline gap-2">
                                          <h3 className="text-white text-lg font-bold">{v.marca} {v.modelo}</h3>
                                          <p className="text-teal-400 text-lg font-bold">${v.precioBase.toLocaleString()}</p>
                                       </div>
                                       <p className="text-slate-500 text-xs mt-1">{TIPO_CATEGORY[v.tipo] || v.tipo} · {v.anio}</p>
                                       <div className="flex flex-wrap gap-2 mt-3 mb-4">
                                          {specEntries.map(([k, val]) => (
                                             <span key={k} className="text-xs text-slate-400 bg-[#0a1225] px-2.5 py-1 rounded border border-[#1a2848] flex items-center gap-1">
                                                {specIcon(k)} {String(val)}
                                             </span>
                                          ))}
                                          <span className="text-xs text-slate-400 bg-[#0a1225] px-2.5 py-1 rounded border border-[#1a2848] flex items-center gap-1">ST {v.stock}</span>
                                       </div>
                                       <div className="flex gap-2 mt-auto">
                                          <button onClick={e => { e.stopPropagation(); setSelectedVehiculo(v); }}
                                             className="flex-1 bg-transparent text-blue-400 py-2 rounded-lg font-semibold text-xs border border-blue-500/50 hover:bg-blue-500/10 transition-colors">
                                             Ver Detalle
                                          </button>
                                          <button onClick={e => { e.stopPropagation(); navigate('/cotizaciones?vehiculoId=' + v.id); }}
                                             disabled={v.stock === 0}
                                             className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                             Cotizar
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>

         {selectedVehiculo && (
            <VehicleDetailModal vehiculo={selectedVehiculo} onClose={() => setSelectedVehiculo(null)} />
         )}
      </div>
   );
};
