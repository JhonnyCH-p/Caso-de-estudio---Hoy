import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DashboardAPI } from '../api/dashboard.api';
import type { DashboardData } from '../types/dashboard.types';

function formatCurrency(n: number): string {
   return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(n);
}

export function DashboardPage() {
   const [data, setData] = useState<DashboardData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      DashboardAPI.get()
         .then(setData)
         .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar dashboard'))
         .finally(() => setLoading(false));
   }, []);

   if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
   );

   if (error) return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{error}</div>
      </div>
   );

   if (!data) return null;

   const { kpis, ventasPorAsesor, tendenciaMensual, topVehiculos } = data;

   return (
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
         <h1 className="text-3xl font-bold text-white mb-8">📈 Dashboard Analítico</h1>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="Vehículos Disponibles" value={kpis.totalVehiculos} icon="🚗" />
            <KpiCard title="Ventas del Mes" value={kpis.ventasMes} icon="💰" />
            <KpiCard title="Ingresos del Mes" value={formatCurrency(kpis.ingresosMes)} icon="📈" />
            <KpiCard title="Cotizaciones Activas" value={kpis.cotizacionesActivas} icon="📋" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Ventas por Asesor">
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ventasPorAsesor.length > 0 ? ventasPorAsesor : []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e2d50" />
                     <XAxis dataKey="asesorNombre" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <Tooltip contentStyle={{ backgroundColor: '#0c1322', border: '1px solid #1e2d50', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                     <Bar dataKey="montoTotal" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Monto Total" />
                  </BarChart>
               </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Tendencia Mensual de Ventas">
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tendenciaMensual.length > 0 ? tendenciaMensual : []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e2d50" />
                     <XAxis dataKey="mes" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <Tooltip contentStyle={{ backgroundColor: '#0c1322', border: '1px solid #1e2d50', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                     <Legend wrapperStyle={{ color: '#94a3b8' }} />
                     <Line type="monotone" dataKey="ventas" stroke="#10b981" name="Ventas" strokeWidth={2} />
                     <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" name="Ingresos" strokeWidth={2} />
                  </LineChart>
               </ResponsiveContainer>
            </ChartCard>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Top 5 Vehículos Más Vendidos">
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topVehiculos.length > 0 ? topVehiculos : []} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e2d50" />
                     <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <YAxis type="category" dataKey="nombre" width={180} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                     <Tooltip contentStyle={{ backgroundColor: '#0c1322', border: '1px solid #1e2d50', borderRadius: '8px', color: '#e2e8f0' }} formatter={(value: any) => (Number(value) || 0).toString()} />
                     <Bar dataKey="totalVentas" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Ventas" />
                  </BarChart>
               </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Resumen de Ventas por Asesor">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#1e2d50]">
                     <thead>
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Asesor</th>
                           <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Ventas</th>
                           <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Monto Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#1e2d50]">
                        {ventasPorAsesor.map(v => (
                           <tr key={v.asesorId} className="hover:bg-[#111c38] transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-white">{v.asesorNombre}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-300">{v.totalVentas}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-300">{formatCurrency(v.montoTotal)}</td>
                           </tr>
                        ))}
                        {ventasPorAsesor.length === 0 && (
                           <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">Sin ventas registradas</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </ChartCard>
         </div>
      </div>
   );
}

function KpiCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
   return (
      <div className="rounded-xl border border-[#1e2d50] bg-[#111c38] p-5">
         <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-slate-400">{title}</span>
         </div>
         <p className="text-3xl font-bold text-white">{value}</p>
      </div>
   );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
   return (
      <div className="bg-[#111c38] rounded-xl border border-[#1e2d50] p-6">
         <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
         {children}
      </div>
   );
}
