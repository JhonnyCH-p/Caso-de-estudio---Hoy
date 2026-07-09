import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/EmployeeForm';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import type { Employee, EmployeeFormState } from '../types/employee.types';

export const EmployeesPage: React.FC = () => {
   const { employees, loading, error, create, update, remove, increaseSalary } = useEmployees();
   const { user } = useAuth();
   const canEdit = user?.rol === 'administrador';
   const [showForm, setShowForm] = useState<boolean>(false);
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

   const initialFormState: EmployeeFormState = { cedula: '', nombres: '', salario: '', departamento: '', activo: true };
   const [formData, setFormData] = useState<EmployeeFormState>(initialFormState);
   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

   const handleCreate = () => {
      setEditingEmployee(null);
      setFormData(initialFormState);
      setFormErrors({});
      setShowForm(true);
   };

   const handleEdit = (employee: Employee) => {
      setEditingEmployee(employee);
      setFormData({
         cedula: employee.cedula,
         nombres: employee.nombres,
         salario: employee.salario.toString(),
         departamento: employee.departamento || '',
         activo: employee.activo,
      });
      setFormErrors({});
      setShowForm(true);
   };

   const handleCloseModal = () => {
      setShowForm(false);
      setEditingEmployee(null);
      setFormData(initialFormState);
      setFormErrors({});
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
   };

   const validateForm = (): boolean => {
      const errors: Record<string, string> = {};
      if (!formData.cedula.trim()) errors.cedula = 'La cédula es requerida';
      else if (formData.cedula.length < 10) errors.cedula = 'La cédula debe tener al menos 10 caracteres';
      if (!formData.nombres.trim()) errors.nombres = 'Los nombres son requeridos';
      else if (formData.nombres.trim().length < 2) errors.nombres = 'Los nombres deben tener al menos 2 caracteres';
      if (!formData.salario) errors.salario = 'El salario es requerido';
      else if (parseFloat(formData.salario) < 0) errors.salario = 'El salario no puede ser negativo';
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);
      try {
         const salary = parseFloat(formData.salario);
         if (editingEmployee) {
            await update(editingEmployee.id, { nombres: formData.nombres, salario: salary, departamento: formData.departamento, activo: formData.activo });
         } else {
            await create({ cedula: formData.cedula, nombres: formData.nombres, salario: salary, departamento: formData.departamento });
         }
         handleCloseModal();
      } catch (err) { console.error(err); }
      finally { setIsSubmitting(false); }
   };

   const handleDelete = async (id: string) => {
      if (window.confirm('¿Estás seguro de eliminar este empleado?')) await remove(id);
   };

   const handleIncreaseSalary = async (id: string) => {
      const pct = window.prompt('Ingrese el porcentaje de aumento (1-100):');
      if (pct) { const num = parseFloat(pct); if (!isNaN(num) && num > 0 && num <= 100) await increaseSalary(id, num); }
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">👥 Gestión de Empleados</h1>
            {canEdit && (
               <button onClick={handleCreate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />Nuevo Empleado
               </button>
            )}
         </div>
         <EmployeeList employees={employees} loading={loading} error={error}
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={canEdit ? handleDelete : undefined}
            onIncreaseSalary={canEdit ? handleIncreaseSalary : undefined} />
         <Modal isOpen={showForm} onClose={handleCloseModal}
            title={editingEmployee ? '✏️ Editar Empleado' : '➕ Nuevo Empleado'}>
            <EmployeeForm formData={formData} errors={formErrors} isSubmitting={isSubmitting}
               onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCloseModal}
               submitLabel={editingEmployee ? 'Actualizar' : 'Crear'} />
         </Modal>
      </div>
   );
};
