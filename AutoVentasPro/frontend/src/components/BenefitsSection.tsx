import React from 'react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
   {
      name: 'Plan Clásico',
      icon: '/resources/Planes Iconos/PlanClasico.png',
      desc: 'Monto de entrada accesible desde el 20%, plazos adaptables de 12 a 36 meses y tasa de interés fija anual del 12.5%.',
   },
   {
      name: 'Plan Ejecutivo',
      icon: '/resources/Planes Iconos/PlanEjecutivo.png',
      desc: 'Entrada mínima del 25%, ampliación de plazos desde 48 a 60 meses, tasa del 10.9% anual y bajas comisiones administrativas.',
   },
   {
      name: 'Plan Premium',
      icon: '/resources/Planes Iconos/PlanPremiun.png',
      desc: 'Estructura preferencial a 72 meses, entrada mínima requerida del 30% y una tasa de interés preferente del 9.5% anual.',
   },
];

export const BenefitsSection: React.FC = () => {
   const navigate = useNavigate();

   return (
      <section className="bg-[#080e1a] py-16 px-10">
         <h2 className="text-center text-3xl font-bold text-white mb-3">Beneficios de Nuestros Planes Financieros</h2>
         <p className="text-center text-slate-400 max-w-[700px] mx-auto mb-12">
            Ofrecemos alternativas accesibles estructuradas bajo el sistema francés con tasas competitivas y plazos cómodos.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(p => (
               <div key={p.name}
                  className="bg-[#111c38] border border-[#1e2d50] rounded-xl p-8 text-center hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-900/20 transition-all cursor-pointer"
                  onClick={() => navigate('/planes')}>
                  <div className="mb-4 flex justify-center h-14">
                     <img src={p.icon} alt={p.name} className="h-14 w-auto object-contain" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{p.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
               </div>
            ))}
         </div>
      </section>
   );
};
