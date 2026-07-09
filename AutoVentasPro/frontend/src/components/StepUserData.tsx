import React, { useState } from 'react';

interface UserDataForm {
   nombre: string;
   cedula: string;
   email: string;
   telefono: string;
   ciudad: string;
}

interface StepUserDataProps {
   onBack: () => void;
   onContinue: (data: UserDataForm) => void;
}

export const StepUserData: React.FC<StepUserDataProps> = ({ onBack, onContinue }) => {
   const [form, setForm] = useState<UserDataForm>({ nombre: '', cedula: '', email: '', telefono: '', ciudad: '' });
   const [errors, setErrors] = useState<Partial<UserDataForm>>({});

   const set = (field: keyof UserDataForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
   };

   const validate = (): boolean => {
      const errs: Partial<UserDataForm> = {};
      if (!form.nombre.trim() || form.nombre.trim().length < 2) errs.nombre = 'Nombre debe tener al menos 2 caracteres';
      if (!form.cedula.trim() || form.cedula.trim().length < 5) errs.cedula = 'Cedula/identificacion invalida';
      if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Email invalido';
      if (!form.telefono.trim() || form.telefono.trim().length < 7) errs.telefono = 'Telefono invalido (min 7 digitos)';
      if (!form.ciudad.trim() || form.ciudad.trim().length < 2) errs.ciudad = 'Ciudad invalida';
      setErrors(errs);
      return Object.keys(errs).length === 0;
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) onContinue(form);
   };

   const inputClass = (field: keyof UserDataForm) =>
      'w-full px-3 py-2.5 bg-[#0a1225] border rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ' +
      (errors[field] ? 'border-red-500/50' : 'border-[#1e2d50]');

   return (
      <form onSubmit={handleSubmit} className="bg-[#0c1322] border border-[#1e2d50] rounded-xl p-6 shadow-lg">
         <h2 className="text-xl font-bold text-white mb-1">Tus Datos</h2>
         <p className="text-slate-400 text-xs mb-5">
            Validamos tus datos de forma segura para generar tu cotizacion
         </p>

         <div className="space-y-4">
            <div>
               <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nombre Completo *</label>
               <input type="text" value={form.nombre} onChange={set('nombre')}
                  placeholder="Ej: Juan Perez" className={inputClass('nombre')} />
               {errors.nombre && <p className="text-red-400 text-[10px] mt-1">{errors.nombre}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cedula / Identificacion *</label>
                  <input type="text" value={form.cedula} onChange={set('cedula')}
                     placeholder="Ej: 1234567890" className={inputClass('cedula')} />
                  {errors.cedula && <p className="text-red-400 text-[10px] mt-1">{errors.cedula}</p>}
               </div>
               <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ciudad *</label>
                  <input type="text" value={form.ciudad} onChange={set('ciudad')}
                     placeholder="Ej: Quito" className={inputClass('ciudad')} />
                  {errors.ciudad && <p className="text-red-400 text-[10px] mt-1">{errors.ciudad}</p>}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email *</label>
                  <input type="email" value={form.email} onChange={set('email')}
                     placeholder="email@ejemplo.com" className={inputClass('email')} />
                  {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
               </div>
               <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Telefono *</label>
                  <input type="tel" value={form.telefono} onChange={set('telefono')}
                     placeholder="0999999999" className={inputClass('telefono')} />
                  {errors.telefono && <p className="text-red-400 text-[10px] mt-1">{errors.telefono}</p>}
               </div>
            </div>
         </div>

         <div className="flex gap-3 mt-8">
            <button type="button" onClick={onBack}
               className="flex-1 bg-[#111c38] text-slate-300 py-2.5 rounded-lg font-semibold text-sm border border-[#1e2d50] hover:bg-[#1a2848] transition-colors">
               Atras
            </button>
            <button type="submit"
               className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
               Continuar
            </button>
         </div>
      </form>
   );
};
