import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
   return (
      <div className="min-h-screen bg-[#080e1a] flex flex-col">
         <nav className="bg-[#0c1322] border-b border-[#1e2d50]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-1 overflow-x-auto">
                     <div className="flex items-center gap-2 mr-6 shrink-0">
                        <img src="/resources/AutoVentasProLogo.png" alt="AutoVentas Pro" className="h-8 w-auto invert brightness-[2]" />
                        <span className="text-white font-bold text-xl tracking-wide">AutoVentas Pro</span>
                     </div>
                     <NavLink to="/" end
                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                        🏠 Inicio
                     </NavLink>
                     <NavLink to="/catalogo"
                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                        🚘 Catálogo
                     </NavLink>
                     <NavLink to="/planes"
                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                        📋 Planes
                     </NavLink>
                     <NavLink to="/cotizaciones"
                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                        📊 Cotizaciones
                     </NavLink>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     <NavLink to="/login"
                        className="text-sm text-slate-400 hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-slate-700/50">
                        Iniciar Sesión
                     </NavLink>
                  </div>
               </div>
            </div>
         </nav>
         <main className="flex-1">
            <Outlet />
         </main>
      </div>
   );
};