import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useVehiculos } from '../hooks/useVehiculos';
import { VehiculoList } from '../components/VehiculoList';
import { VehiculoForm } from '../components/VehiculoForm';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import type { Vehiculo, VehiculoFormState } from '../types/vehiculo.types';

export const VehiculosPage: React.FC = () => {
   const { vehiculos, loading, error, create, update, remove, adjustStock } = useVehiculos();
   const { user } = useAuth();
   const canEdit = user?.rol === 'administrador' || user?.rol === 'jefe_ventas';
   const [showForm, setShowForm] = useState(false);
   const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const initialFormState: VehiculoFormState = { marca: '', modelo: '', anio: '', precioBase: '', tipo: '', stock: '0', especificaciones: '', imagen: '', activo: true };
   const [formData, setFormData] = useState<VehiculoFormState>(initialFormState);
   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

   const handleCreate = () => {
      setEditingVehiculo(null);
      setFormData(initialFormState);
      setFormErrors({});
      setShowForm(true);
   };

   const handleEdit = (v: Vehiculo) => {
      setEditingVehiculo(v);
      setFormData({
         marca: v.marca, modelo: v.modelo, anio: v.anio.toString(), precioBase: v.precioBase.toString(),
         tipo: v.tipo, stock: v.stock.toString(), especificaciones: v.especificaciones || '',
         imagen: v.imagen || '', activo: v.activo,
      });
      setFormErrors({});
      setShowForm(true);
   };

   const handleCloseModal = () => {
      setShowForm(false);
      setEditingVehiculo(null);
      setFormData(initialFormState);
      setFormErrors({});
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
   };

   const validateForm = (): boolean => {
      const errors: Record<string, string> = {};
      if (!formData.marca.trim()) errors.marca = 'La marca es requerida';
      if (!formData.modelo.trim()) errors.modelo = 'El modelo es requerido';
      if (!formData.anio.trim() || parseInt(formData.anio) < 2000) errors.anio = 'Año inválido (mín 2000)';
      if (!formData.precioBase.trim() || parseFloat(formData.precioBase) <= 0) errors.precioBase = 'Precio inválido';
      if (!formData.tipo) errors.tipo = 'Seleccione un tipo';
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);
      try {
         if (editingVehiculo) {
            await update(editingVehiculo.id, {
               marca: formData.marca, modelo: formData.modelo, anio: parseInt(formData.anio),
               precioBase: parseFloat(formData.precioBase), tipo: formData.tipo,
               stock: parseInt(formData.stock) || 0, especificaciones: formData.especificaciones,
               imagen: formData.imagen || null, activo: formData.activo,
            });
         } else {
            await create({
               marca: formData.marca, modelo: formData.modelo, anio: parseInt(formData.anio),
               precioBase: parseFloat(formData.precioBase), tipo: formData.tipo,
               stock: parseInt(formData.stock) || 0, especificaciones: formData.especificaciones,
               imagen: formData.imagen || undefined,
            });
         }
         handleCloseModal();
      } catch (err) { console.error(err); }
      finally { setIsSubmitting(false); }
   };

   const handleDelete = async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar este vehículo?')) await remove(id);
   };

   const handleAdjustStock = async (id: string) => {
      const cantidad = window.prompt('Ingrese la cantidad a agregar (positivo) o quitar (negativo):');
      if (cantidad) { const num = parseInt(cantidad); if (!isNaN(num)) await adjustStock(id, num); }
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">🚗 Gestión de Vehículos</h1>
            {canEdit && (
               <button onClick={handleCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />Nuevo Vehículo
               </button>
            )}
         </div>
         <VehiculoList vehiculos={vehiculos} loading={loading} error={error}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canEdit ? handleDelete : undefined}
            onAdjustStock={canEdit ? handleAdjustStock : undefined} />
         <Modal isOpen={showForm} onClose={handleCloseModal}
            title={editingVehiculo ? '✏️ Editar Vehículo' : '➕ Nuevo Vehículo'}>
            <VehiculoForm formData={formData} errors={formErrors} isSubmitting={isSubmitting}
               onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCloseModal}
               submitLabel={editingVehiculo ? 'Actualizar' : 'Crear'} />
         </Modal>
      </div>
   );
};
