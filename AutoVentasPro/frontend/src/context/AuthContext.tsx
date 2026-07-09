import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthAPI, type AuthUser } from '../api/auth.api';

interface AuthContextType {
   user: AuthUser | null;
   token: string | null;
   loading: boolean;
   login: (usuario: string, password: string) => Promise<void>;
   logout: () => void;
   isAuthenticated: boolean;
   hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'autoventas_token';
const USER_KEY = 'autoventas_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<AuthUser | null>(() => {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
   });
   const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (token) {
         AuthAPI.getProfile()
            .then(u => { setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); })
            .catch(() => { setToken(null); setUser(null); localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); })
            .finally(() => setLoading(false));
      } else {
         setLoading(false);
      }
   }, []);

   const login = useCallback(async (usuario: string, password: string) => {
      const result = await AuthAPI.login(usuario, password);
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
   }, []);

   const logout = useCallback(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
   }, []);

   const hasRole = useCallback((...roles: string[]) => {
      if (!user) return false;
      return roles.includes(user.rol);
   }, [user]);

   return (
      <AuthContext.Provider value={{
         user, token, loading,
         login, logout,
         isAuthenticated: !!user,
         hasRole,
      }}>
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth(): AuthContextType {
   const ctx = useContext(AuthContext);
   if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
   return ctx;
}
