import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { UsuarioAPI } from '../api/usuario.api';
import { UsuarioForm } from '../components/UsuarioForm';
import { Modal } from '../components/Modal';
import type { Usuario, UsuarioFormState } from '../types/usuario.types';

function getErrorMessage(error: unknown): string {
   if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) return err.response.data.message;
   }
   if (error instanceof Error) return error.message;
   return 'Ocurrió un error';
}

const initialFormState: UsuarioFormState = {
   usuario: '', password: '', rol: '',
   especialidad: '', experienciaAnios: '', metaMensual: '',
   areaResponsable: '', bonoGestion: '', nivelPermiso: '',
   activo: true,
};

const ROL_BADGE: Record<string, string> = {
   administrador: 'bg-purple-100 text-purple-800',
   jefe_ventas: 'bg-blue-100 text-blue-800',
   asesor: 'bg-green-100 text-green-800',
};

export const UsuariosPage: React.FC = () => {
   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [showForm, setShowForm] = useState(false);
   const [editingUser, setEditingUser] = useState<Usuario | null>(null);
   const [formData, setFormData] = useState<UsuarioFormState>(initialFormState);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const fetchAll = useCallback(async () => {
      setLoading(true); setError(null);
      try { const data = await UsuarioAPI.getAll(); setUsuarios(data); }
      catch (err) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
   }, []);

   useEffect(() => { fetchAll(); }, [fetchAll]);

   const handleCreate = () => {
      setEditingUser(null);
      setFormData(initialFormState);
      setShowForm(true);
   };

   const handleEdit = (u: Usuario) => {
      setEditingUser(u);
      setFormData({
         usuario: u.usuario, password: '', rol: u.rol,
         especialidad: u.especialidad || '', experienciaAnios: u.experienciaAnios?.toString() || '',
         metaMensual: u.metaMensual?.toString() || '',
         areaResponsable: u.areaResponsable || '', bonoGestion: u.bonoGestion?.toString() || '',
         nivelPermiso: u.nivelPermiso || '', activo: u.activo,
      });
      setShowForm(true);
   };

   const handleCloseModal = () => {
      setShowForm(false);
      setEditingUser(null);
      setFormData(initialFormState);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
   };

   const handlePasswordChange = async () => {
      if (!editingUser || !formData.password.trim()) return;
      setIsSubmitting(true);
      try {
         await UsuarioAPI.update(editingUser.id, { password: formData.password });
         setFormData(prev => ({ ...prev, password: '' }));
         await fetchAll();
         alert('Contraseña actualizada correctamente');
      } catch (err) { alert(getErrorMessage(err)); }
      finally { setIsSubmitting(false); }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
         if (editingUser) {
            const payload: Record<string, any> = { activo: formData.activo };
            if (formData.usuario !== editingUser.usuario) payload.usuario = formData.usuario;
            if (formData.especialidad !== undefined) payload.especialidad = formData.especialidad || undefined;
            if (formData.experienciaAnios) payload.experienciaAnios = parseInt(formData.experienciaAnios);
            if (formData.metaMensual) payload.metaMensual = parseInt(formData.metaMensual);
            if (formData.areaResponsable) payload.areaResponsable = formData.areaResponsable || undefined;
            if (formData.bonoGestion) payload.bonoGestion = parseFloat(formData.bonoGestion);
            if (formData.nivelPermiso) payload.nivelPermiso = formData.nivelPermiso || undefined;
            if (formData.password.trim()) payload.password = formData.password;
            await UsuarioAPI.update(editingUser.id, payload);
         } else {
            await UsuarioAPI.create({
               usuario: formData.usuario, password: formData.password,
               rol: formData.rol as any,
               especialidad: formData.especialidad || undefined,
               experienciaAnios: formData.experienciaAnios ? parseInt(formData.experienciaAnios) : undefined,
               metaMensual: formData.metaMensual ? parseInt(formData.metaMensual) : undefined,
               areaResponsable: formData.areaResponsable || undefined,
               bonoGestion: formData.bonoGestion ? parseFloat(formData.bonoGestion) : undefined,
               nivelPermiso: formData.nivelPermiso || undefined,
            });
         }
         handleCloseModal();
         await fetchAll();
      } catch (err) { alert(getErrorMessage(err)); }
      finally { setIsSubmitting(false); }
   };

   const handleDelete = async (id: string) => {
      if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
      try { await UsuarioAPI.delete(id); await fetchAll(); }
      catch (err) { alert(getErrorMessage(err)); }
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">👥 Gestión de Usuarios</h1>
            <button onClick={handleCreate}
               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
               <PlusIcon className="h-5 w-5 mr-2" />Nuevo Usuario
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>
         ) : error ? (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded">❌ {error}</div>
         ) : usuarios.length === 0 ? (
            <div className="text-center py-12 bg-[#0c1322] border border-[#1e2d50] rounded-lg">
               <p className="text-slate-400 text-lg">No hay usuarios registrados</p>
            </div>
         ) : (
            <div className="overflow-x-auto shadow-md rounded-lg border border-[#1e2d50]">
               <table className="min-w-full bg-[#0c1322]">
                  <thead className="bg-[#111c38] border-b border-[#1e2d50]">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Usuario</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Rol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Último Acceso</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Especialidad</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Acciones</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2d50]">
                     {usuarios.map(u => (
                        <tr key={u.id} className="hover:bg-[#111c38] transition-colors">
                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{u.usuario}</td>
                           <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROL_BADGE[u.rol] || 'bg-gray-100 text-gray-800'}`}>
                                 {u.rol.replace('_', ' ')}
                              </span>
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.activo ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                 {u.activo ? 'Activo' : 'Inactivo'}
                              </span>
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                              {u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleDateString() : 'Nunca'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                              {u.especialidad || u.areaResponsable || u.nivelPermiso || '—'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEdit(u)}
                                 className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">✏️</button>
                              <button onClick={() => handleDelete(u.id)}
                                 className="text-red-400 hover:text-red-300 transition-colors">🗑️</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         <Modal isOpen={showForm} onClose={handleCloseModal}
            title={editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}>
            <UsuarioForm
               formData={formData} isSubmitting={isSubmitting} isEdit={!!editingUser}
               onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCloseModal}
               onPasswordChange={editingUser ? handlePasswordChange : undefined}
            />
         </Modal>
      </div>
   );
};
