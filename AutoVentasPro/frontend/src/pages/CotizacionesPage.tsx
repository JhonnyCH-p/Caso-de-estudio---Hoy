import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCotizaciones } from '../hooks/useCotizaciones';
import { apiClient } from '../api/client';
import { CotizadorSimulator } from '../components/CotizadorSimulator';
import { StepIndicator } from '../components/StepIndicator';
import { StepUserData } from '../components/StepUserData';
import { StepConfirmation } from '../components/StepConfirmation';
import { CotizacionList } from '../components/CotizacionList';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import type { Cotizacion, SimulacionResult } from '../types/cotizacion.types';
import type { Vehiculo } from '../types/vehiculo.types';
import type { PlanFinanciamiento } from '../types/plan.types';

interface SimParams {
   vehiculoId: string;
   planId: string;
   entrada: number;
   plazoMeses: number;
   vehiculo: Vehiculo;
   plan: PlanFinanciamiento;
}

interface UserData {
   nombre: string;
   cedula: string;
   email: string;
   telefono: string;
   ciudad: string;
}

export const CotizacionesPage: React.FC = () => {
   const { cotizaciones, loading, error, fetchAll, updateStatus, remove } = useCotizaciones();
   const { user } = useAuth();
   const [searchParams] = useSearchParams();
   const canEdit = user?.rol === 'administrador' || user?.rol === 'jefe_ventas';
   const [showDetail, setShowDetail] = useState(false);
   const [detailCotizacion, setDetailCotizacion] = useState<Cotizacion | null>(null);

   const initialVehiculoId = searchParams.get('vehiculoId') || undefined;

   const [currentStep, setCurrentStep] = useState(initialVehiculoId ? 2 : 2);
   const [simulacion, setSimulacion] = useState<SimulacionResult | null>(null);
   const [simParams, setSimParams] = useState<SimParams | null>(null);
   const [userData, setUserData] = useState<UserData | null>(null);
   const [submitting, setSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');

   const handleSimulate = (result: SimulacionResult, params: SimParams) => {
      setSimulacion(result);
      setSimParams(params);
      setCurrentStep(3);
   };

   const handleUserData = (data: UserData) => {
      setUserData(data);
      setCurrentStep(4);
   };

   const handleBack = () => {
      if (currentStep === 3) setCurrentStep(2);
      else if (currentStep === 4) setCurrentStep(3);
   };

   const handleConfirm = async () => {
      if (!simParams || !userData || !simulacion) return;
      setSubmitting(true);
      setSubmitError('');
      try {
         await apiClient.post('/api/cotizaciones', {
            vehiculoId: simParams.vehiculoId,
            planId: simParams.planId,
            clienteNombre: userData.nombre,
            clienteEmail: userData.email,
            clienteTelefono: userData.telefono,
            clienteCedula: userData.cedula,
            clienteCiudad: userData.ciudad,
            entrada: simParams.entrada,
            plazoMeses: simParams.plazoMeses,
         });
         setSimulacion(null);
         setSimParams(null);
         setUserData(null);
         setCurrentStep(2);
         fetchAll();
      } catch (err: unknown) {
         const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Error al crear cotizacion';
         setSubmitError(msg);
      } finally {
         setSubmitting(false);
      }
   };

   const handleViewDetail = (c: Cotizacion) => {
      setDetailCotizacion(c);
      setShowDetail(true);
   };

   const handleAprobar = async (c: Cotizacion) => {
      const msg = 'Aprobar cotizacion de ' + c.clienteNombre + '?';
      if (window.confirm(msg)) {
         await updateStatus(c.id, { estado: 'APROBADA' });
      }
   };

   const handleDelete = async (id: string) => {
      if (window.confirm('Eliminar esta cotizacion?')) await remove(id);
   };

   const formatCurrency = (n: number) => '$' + n.toLocaleString('es-CL');

   const estadoBadge = (estado: string) => {
      const colors: Record<string, string> = {
         PENDIENTE: 'bg-yellow-600/30 text-yellow-400 border-yellow-600/50',
         APROBADA: 'bg-green-600/30 text-green-400 border-green-600/50',
         RECHAZADA: 'bg-red-600/30 text-red-400 border-red-600/50',
         EXPIRADA: 'bg-slate-600/30 text-slate-400 border-slate-600/50',
      };
      return colors[estado] || 'bg-slate-600/30 text-slate-400 border-slate-600/50';
   };

   const renderStepContent = () => {
      switch (currentStep) {
         case 2:
            return (
               <CotizadorSimulator
                  onSimulate={handleSimulate}
                  initialVehiculoId={initialVehiculoId}
               />
            );
         case 3:
            return (
               <StepUserData onBack={handleBack} onContinue={handleUserData} />
            );
         case 4: {
            return (
               <StepConfirmation
                  vehiculo={simParams?.vehiculo || null}
                  plan={simParams?.plan || null}
                  simulacion={simulacion}
                  entrada={String(simParams?.entrada || '0')}
                  plazoMeses={String(simParams?.plazoMeses || '')}
                  userData={userData}
                  submitting={submitting}
                  onBack={handleBack}
                  onConfirm={handleConfirm}
               />
            );
         }
         default:
            return null;
      }
   };

   return (
      <div className="min-h-screen bg-[#080e1a]">
         <div className="relative h-[240px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-[#080e1a]" />
            <div className="absolute inset-0 bg-[url('/resources/slider1.jpg')] bg-cover bg-center bg-no-repeat opacity-15" />
            <div className="relative z-[1] text-center px-6">
               <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Cotizaciones</h1>
               <p className="text-lg text-slate-400 max-w-[600px] mx-auto">
                  Simula financiamientos personalizados usando nuestro sistema de amortizacion francesa.
               </p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-10 pb-16">
            <StepIndicator currentStep={currentStep} />

            {submitError && (
               <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 mb-6">{submitError}</div>
            )}

            {renderStepContent()}

            {currentStep === 2 && cotizaciones.length > 0 && (
               <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <h2 className="text-xl font-bold text-white">Historial de Cotizaciones</h2>
                        <p className="text-slate-400 text-sm mt-1">Todas las cotizaciones registradas en el sistema</p>
                     </div>
                  </div>
                  <div className="bg-[#111c38] rounded-xl border border-[#1e2d50] overflow-hidden">
                     <CotizacionList cotizaciones={cotizaciones} loading={loading} error={error}
                        onViewDetail={handleViewDetail}
                        onAprobar={canEdit ? handleAprobar : undefined}
                        onDelete={canEdit ? handleDelete : undefined} />
                  </div>
               </div>
            )}
         </div>

         <Modal isOpen={showDetail} onClose={() => { setShowDetail(false); setDetailCotizacion(null); }} title="Detalle de Cotizacion">
            {detailCotizacion && (
               <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                     <p><span className="text-slate-400">Cliente:</span> <span className="text-white">{detailCotizacion.clienteNombre}</span></p>
                     <p><span className="text-slate-400">Cedula:</span> <span className="text-white">{detailCotizacion.clienteCedula}</span></p>
                     <p><span className="text-slate-400">Email:</span> <span className="text-white">{detailCotizacion.clienteEmail}</span></p>
                     <p><span className="text-slate-400">Telefono:</span> <span className="text-white">{detailCotizacion.clienteTelefono}</span></p>
                     <p><span className="text-slate-400">Ciudad:</span> <span className="text-white">{detailCotizacion.clienteCiudad}</span></p>
                     <p><span className="text-slate-400">Monto Financiado:</span> <span className="text-white">{formatCurrency(detailCotizacion.montoFinanciado)}</span></p>
                     <p><span className="text-slate-400">Entrada:</span> <span className="text-white">{formatCurrency(detailCotizacion.entrada)}</span></p>
                     <p><span className="text-slate-400">Plazo:</span> <span className="text-white">{detailCotizacion.plazoMeses} meses</span></p>
                     <p><span className="text-slate-400">Cuota Mensual:</span> <span className="text-teal-400 font-bold">{formatCurrency(detailCotizacion.cuotaMensual)}</span></p>
                     <p><span className="text-slate-400">Estado:</span>
                        <span className={'ml-1 px-2 py-0.5 rounded text-xs font-semibold border ' + estadoBadge(detailCotizacion.estado)}>
                           {detailCotizacion.estado}
                        </span>
                     </p>
                  </div>
                  <div className="border-t border-[#1e2d50] pt-3 mt-3">
                     <p className="text-slate-400 mb-1">Resumen Financiero:</p>
                     <p className="text-white">Total Intereses: {formatCurrency(detailCotizacion.totalIntereses)}</p>
                     <p className="text-white">Total Pagado: {formatCurrency(detailCotizacion.totalPagado)}</p>
                  </div>
                  {detailCotizacion.tablaAmortizacion?.length > 0 && (
                     <div className="border-t border-[#1e2d50] pt-3 mt-3">
                        <p className="text-slate-400 mb-2">Tabla de Amortizacion:</p>
                        <div className="max-h-48 overflow-y-auto">
                           <table className="w-full text-xs">
                              <thead><tr className="text-slate-500"><th className="text-left p-1">#</th><th className="text-right p-1">Capital</th><th className="text-right p-1">Interes</th><th className="text-right p-1">Saldo</th></tr></thead>
                              <tbody>
                                 {detailCotizacion.tablaAmortizacion.map((f, i) => (
                                 <tr key={i} className="border-t border-[#1e2d50]/50">
                                    <td className="p-1 text-slate-400">{f.cuota}</td>
                                    <td className="p-1 text-right text-slate-300">{formatCurrency(f.capital)}</td>
                                    <td className="p-1 text-right text-slate-300">{formatCurrency(f.interes)}</td>
                                    <td className="p-1 text-right text-slate-300">{formatCurrency(f.saldo)}</td>
                                 </tr>
                              ))}</tbody>
                           </table>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </Modal>
      </div>
   );
};
