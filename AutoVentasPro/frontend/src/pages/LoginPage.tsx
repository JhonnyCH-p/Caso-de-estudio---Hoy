import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
   const { login, isAuthenticated, loading: authLoading } = useAuth();
   const navigate = useNavigate();
   const [usuario, setUsuario] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (isAuthenticated) navigate('/employees', { replace: true });
   }, [isAuthenticated, navigate]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      if (!usuario.trim() || !password.trim()) {
         setError('Ingrese usuario y contraseña'); return;
      }
      setLoading(true);
      try {
         await login(usuario, password);
          navigate('/employees', { replace: true });
      } catch (err: unknown) {
         const msg = typeof err === 'object' && err !== null
            ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Credenciales inválidas')
            : 'Error de conexión';
         setError(msg);
      } finally {
         setLoading(false);
      }
   };

   if (authLoading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-4">
         <div className="bg-[#111c38] rounded-2xl border border-[#1e2d50] shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-white">AutoVentas Pro</h1>
               <p className="text-slate-400 mt-2">Inicia sesión para continuar</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
                  <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)}
                     placeholder="Ingrese su usuario"
                     className="w-full px-4 py-3 bg-[#0a1225] border border-[#1e2d50] text-slate-300 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                     disabled={loading} autoFocus />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                     placeholder="Ingrese su contraseña"
                     className="w-full px-4 py-3 bg-[#0a1225] border border-[#1e2d50] text-slate-300 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                     disabled={loading} />
               </div>
               {error && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                     {error}
                  </div>
               )}
               <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Ingresando...' : 'Ingresar'}
               </button>
            </form>
            <div className="mt-6 pt-4 border-t border-[#1e2d50] text-xs text-slate-500 text-center space-y-1">
               <p>Usuarios de prueba:</p>
               <p><strong className="text-slate-300">admin</strong> / admin123 (admin) — <strong className="text-slate-300">carlos</strong> / asesor123 (asesor)</p>
            </div>
         </div>
      </div>
   );
};
