import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROL_BADGE: Record<string, string> = {
   administrador: 'bg-purple-900/50 text-purple-300',
   jefe_ventas: 'bg-blue-900/50 text-blue-300',
   asesor: 'bg-green-900/50 text-green-300',
};

const ROL_TABS: Record<string, Array<{ to: string; label: string }>> = {
   administrador: [
      { to: '/employees', label: '👥 Empleados' },
      { to: '/usuarios', label: '🔐 Usuarios' },
      { to: '/vehiculos', label: '🚗 Vehículos' },
      { to: '/ventas', label: '💰 Ventas' },
      { to: '/dashboard', label: '📈 Dashboard' },
   ],
   jefe_ventas: [
      { to: '/vehiculos', label: '🚗 Vehículos' },
      { to: '/ventas', label: '💰 Ventas' },
      { to: '/dashboard', label: '📈 Dashboard' },
   ],
   asesor: [
      { to: '/ventas', label: '💰 Ventas' },
   ],
};

export const AdminLayout: React.FC = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/');
   };

   const tabs = ROL_TABS[user?.rol || ''] || [];

   return (
      <div className="min-h-screen bg-[#080e1a] flex flex-col">
         <nav className="bg-[#0c1322] border-b border-[#1e2d50]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-1 overflow-x-auto">
                     <div className="flex items-center gap-2 mr-6 shrink-0">
                        <img src="/resources/AutoVentasProLogo.png" alt="AutoVentas Pro" className="h-8 w-auto invert brightness-[2]" />
                        <span className="text-white font-bold text-xl tracking-wide">Gestión</span>
                     </div>
                     {tabs.map(tab => (
                        <NavLink key={tab.to} to={tab.to} end={tab.to === '/employees'}
                           className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                           {tab.label}
                        </NavLink>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                     <span className="text-sm text-slate-400">{user?.usuario}</span>
                     <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROL_BADGE[user?.rol || ''] || 'bg-gray-100 text-gray-800'}`}>
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
         <main className="flex-1 p-6">
            <Outlet />
         </main>
      </div>
   );
};
