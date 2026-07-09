import React from 'react';

const TIPOS = ['SUV', 'SEDAN', 'HATCHBACK', 'PICKUP', 'DEPORTIVO', 'ELÉCTRICO', 'HÍBRIDO'];

interface CatalogFiltersProps {
   search: string;
   setSearch: (v: string) => void;
   tipoFiltro: string;
   setTipoFiltro: (v: string) => void;
   minPrice: string;
   setMinPrice: (v: string) => void;
   maxPrice: string;
   setMaxPrice: (v: string) => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
   search, setSearch, tipoFiltro, setTipoFiltro, minPrice, setMinPrice, maxPrice, setMaxPrice,
}) => {
   return (
      <div className="space-y-5">
         <div>
            <div className="relative">
               <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por marca o modelo..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
         </div>

         <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Tipo</p>
            <div className="flex flex-wrap gap-2">
               <button onClick={() => setTipoFiltro('')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${!tipoFiltro ? 'bg-blue-600 text-white' : 'bg-[#111c38] text-slate-400 border border-[#1e2d50] hover:border-blue-500'}`}>
                  Todos
               </button>
               {TIPOS.map(t => (
                  <button key={t} onClick={() => setTipoFiltro(t)}
                     className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${tipoFiltro === t ? 'bg-blue-600 text-white' : 'bg-[#111c38] text-slate-400 border border-[#1e2d50] hover:border-blue-500'}`}>
                     {t}
                  </button>
               ))}
            </div>
         </div>

         <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Rango de Precio</p>
            <div className="flex gap-2 items-center">
               <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  placeholder="Min" min={0}
                  className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
               <span className="text-slate-500 text-xs">—</span>
               <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Max" min={0}
                  className="w-full px-3 py-2 bg-[#0a1225] border border-[#1e2d50] rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
         </div>

         {(search || tipoFiltro || minPrice || maxPrice) && (
            <button onClick={() => { setSearch(''); setTipoFiltro(''); setMinPrice(''); setMaxPrice(''); }}
               className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
               Limpiar filtros
            </button>
         )}
      </div>
   );
};
