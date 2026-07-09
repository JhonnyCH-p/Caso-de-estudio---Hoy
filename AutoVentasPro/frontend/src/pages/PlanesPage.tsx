import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { usePlanes } from '../hooks/usePlanes';
import { PlanList } from '../components/PlanList';
import { PlanForm } from '../components/PlanForm';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import type { PlanFinanciamiento, PlanFormState } from '../types/plan.types';

export const PlanesPage: React.FC = () => {
   const { planes, loading, error, create, update, remove } = usePlanes();
   const { user } = useAuth();
   const canEdit = user?.rol === 'administrador' || user?.rol === 'jefe_ventas';
   const [showForm, setShowForm] = useState(false);
   const [editingPlan, setEditingPlan] = useState<PlanFinanciamiento | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const initialFormState: PlanFormState = { nombre: '', entradaMinima: '', tasaInteresAnual: '', plazosDisponibles: '', comision: '', activo: true };
   const [formData, setFormData] = useState<PlanFormState>(initialFormState);
   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

   const handleCreate = () => {
      setEditingPlan(null);
      setFormData(initialFormState);
      setFormErrors({});
      setShowForm(true);
   };

   const handleEdit = (p: PlanFinanciamiento) => {
      setEditingPlan(p);
      setFormData({
         nombre: p.nombre, entradaMinima: p.entradaMinima.toString(),
         tasaInteresAnual: p.tasaInteresAnual.toString(),
         plazosDisponibles: (p.plazosDisponibles || []).join(', '),
         comision: (p.comision || 0).toString(), activo: p.activo,
      });
      setFormErrors({});
      setShowForm(true);
   };

   const handleCloseModal = () => {
      setShowForm(false);
      setEditingPlan(null);
      setFormData(initialFormState);
      setFormErrors({});
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
   };

   const validateForm = (): boolean => {
      const errors: Record<string, string> = {};
      if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
      if (!formData.entradaMinima.trim() || parseFloat(formData.entradaMinima) < 0) errors.entradaMinima = 'Ingrese un valor válido';
      if (!formData.tasaInteresAnual.trim() || parseFloat(formData.tasaInteresAnual) <= 0) errors.tasaInteresAnual = 'Ingrese una tasa válida';
      if (!formData.plazosDisponibles.trim()) errors.plazosDisponibles = 'Ingrese al menos un plazo';
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);
      try {
         const plazos = formData.plazosDisponibles.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
         if (editingPlan) {
            await update(editingPlan.id, {
               nombre: formData.nombre, entradaMinima: parseFloat(formData.entradaMinima),
               tasaInteresAnual: parseFloat(formData.tasaInteresAnual), plazosDisponibles: plazos,
               comision: parseFloat(formData.comision) || 0, activo: formData.activo,
            });
         } else {
            await create({
               nombre: formData.nombre, entradaMinima: parseFloat(formData.entradaMinima),
               tasaInteresAnual: parseFloat(formData.tasaInteresAnual), plazosDisponibles: plazos,
               comision: parseFloat(formData.comision) || 0,
            });
         }
         handleCloseModal();
      } catch (err) { console.error(err); }
      finally { setIsSubmitting(false); }
   };

   const handleDelete = async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar este plan financiero?')) await remove(id);
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">📋 Planes de Financiamiento</h1>
            {canEdit && (
               <button onClick={handleCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />Nuevo Plan
               </button>
            )}
         </div>
         <PlanList planes={planes} loading={loading} error={error}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canEdit ? handleDelete : undefined} />
         <Modal isOpen={showForm} onClose={handleCloseModal}
            title={editingPlan ? '✏️ Editar Plan' : '➕ Nuevo Plan'}>
            <PlanForm formData={formData} errors={formErrors} isSubmitting={isSubmitting}
               onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCloseModal}
               submitLabel={editingPlan ? 'Actualizar' : 'Crear'} />
         </Modal>
      </div>
   );
};
