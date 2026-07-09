import React, { type PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
   roles?: string[];
}

export const ProtectedRoute: React.FC<PropsWithChildren<ProtectedRouteProps>> = ({ roles, children }) => {
   const { isAuthenticated, hasRole, loading } = useAuth();

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#080e1a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   if (!isAuthenticated) return <Navigate to="/login" replace />;

   if (roles && !hasRole(...roles)) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#080e1a]">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
               <p className="text-slate-400">No tienes permisos para acceder a esta página</p>
            </div>
         </div>
      );
   }

   return children ? <>{children}</> : <Outlet />;
};
