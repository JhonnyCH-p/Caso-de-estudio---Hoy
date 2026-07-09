import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItem {
   to: string;
   label: string;
   icon: string;
   end: boolean;
   roles: string[];
}

const NAV_ITEMS: NavItem[] = [
   { to: '/', label: 'Inicio', icon: '🏠', end: true, roles: ['administrador', 'jefe_ventas', 'asesor'] },
   { to: '/catalogo', label: 'Catálogo', icon: '🚘', end: false, roles: ['administrador', 'jefe_ventas', 'asesor'] },
   { to: '/employees', label: 'Empleados', icon: '👥', end: false, roles: ['administrador', 'jefe_ventas'] },
   { to: '/vehiculos', label: 'Gestión Vehículos', icon: '⚙️', end: false, roles: ['administrador', 'jefe_ventas'] },
   { to: '/planes', label: 'Planes', icon: '📋', end: false, roles: ['administrador', 'jefe_ventas', 'asesor'] },
   { to: '/cotizaciones', label: 'Cotizaciones', icon: '📊', end: false, roles: ['administrador', 'jefe_ventas', 'asesor'] },
   { to: '/ventas', label: 'Ventas', icon: '💰', end: false, roles: ['administrador', 'jefe_ventas', 'asesor'] },
   { to: '/dashboard', label: 'Dashboard', icon: '📈', end: false, roles: ['administrador', 'jefe_ventas'] },
];

const ROL_BADGE: Record<string, string> = {
   administrador: 'bg-purple-900/30 text-purple-400 border border-purple-700/50',
   jefe_ventas: 'bg-blue-900/30 text-blue-400 border border-blue-700/50',
   asesor: 'bg-green-900/30 text-green-400 border border-green-700/50',
};

export const Layout: React.FC = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.rol || ''));

   return (
      <div className="min-h-screen bg-[#080e1a] flex flex-col">
         <nav className="bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-1 overflow-x-auto">
                     <div className="flex items-center gap-2 mr-6 shrink-0">
                        <img src="/resources/AutoVentasProLogo.png" alt="AutoVentas Pro" className="h-8 w-auto invert brightness-[2]" />
                        <span className="text-white font-bold text-xl tracking-wide">AutoVentas Pro</span>
                     </div>
                     {visibleItems.map(item => (
                        <NavLink key={item.to} to={item.to} end={item.end}
                           className={({ isActive }) =>
                              `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${
                                 isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                              }`
                           }>
                           {item.icon} {item.label}
                        </NavLink>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     <span className="text-sm text-slate-300">{user?.usuario}</span>
                     <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROL_BADGE[user?.rol || ''] || 'bg-slate-800/30 text-slate-400 border border-slate-600/50'}`}>
                        {user?.rol?.replace('_', ' ')}
                     </span>
                     <button onClick={handleLogout}
                        className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
                        Salir
                     </button>
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
