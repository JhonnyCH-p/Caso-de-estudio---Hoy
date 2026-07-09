import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useVentas } from '../hooks/useVentas';
import { VentaList } from '../components/VentaList';
import { VentaForm } from '../components/VentaForm';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export const VentasPage: React.FC = () => {
   const { ventas, loading, error, create, updateStatus, remove } = useVentas();
   const { user } = useAuth();
   const canEdit = user?.rol === 'administrador' || user?.rol === 'jefe_ventas';
   const [showForm, setShowForm] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleCreate = () => setShowForm(true);
   const handleCloseModal = () => setShowForm(false);

   const handleSubmit = async (data: { cotizacionId: string; asesorId: string; valorTotal: number }) => {
      setIsSubmitting(true);
      try {
         await create(data);
         setShowForm(false);
      } catch (err) { console.error(err); }
      finally { setIsSubmitting(false); }
   };

   const handleAprobar = async (v: { id: string }) => {
      if (window.confirm('¿Aprobar esta venta?')) await updateStatus(v.id, { estado: 'APROBADA' });
   };

   const handleDelete = async (id: string) => {
      if (window.confirm('¿Eliminar esta venta?')) await remove(id);
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">💰 Ventas</h1>
            {canEdit && (
               <button onClick={handleCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />Nueva Venta
               </button>
            )}
         </div>
         <VentaList ventas={ventas} loading={loading} error={error}
            onAprobar={canEdit ? handleAprobar : undefined}
            onDelete={canEdit ? handleDelete : undefined} />
         <Modal isOpen={showForm} onClose={handleCloseModal} title="➕ Nueva Venta">
            <VentaForm isSubmitting={isSubmitting} onSubmit={handleSubmit} onCancel={handleCloseModal} />
         </Modal>
      </div>
   );
};
