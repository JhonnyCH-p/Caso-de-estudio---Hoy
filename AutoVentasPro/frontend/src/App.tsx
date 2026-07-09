import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { VehiculosPage } from './pages/VehiculosPage';
import { PlanesPage } from './pages/PlanesPage';
import { CotizacionesPage } from './pages/CotizacionesPage';
import { VentasPage } from './pages/VentasPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PublicLayout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/catalogo" element={<CatalogPage />} />
               <Route path="/planes" element={<PlanesPage />} />
               <Route path="/cotizaciones" element={<CotizacionesPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
               <Route element={<AdminLayout />}>
                  <Route path="/employees" element={<ProtectedRoute roles={['administrador', 'jefe_ventas']}><EmployeesPage /></ProtectedRoute>} />
                  <Route path="/usuarios" element={<ProtectedRoute roles={['administrador']}><UsuariosPage /></ProtectedRoute>} />
                  <Route path="/vehiculos" element={<ProtectedRoute roles={['administrador', 'jefe_ventas']}><VehiculosPage /></ProtectedRoute>} />
                  <Route path="/ventas" element={<ProtectedRoute roles={['administrador', 'jefe_ventas', 'asesor']}><VentasPage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute roles={['administrador', 'jefe_ventas']}><DashboardPage /></ProtectedRoute>} />
               </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;