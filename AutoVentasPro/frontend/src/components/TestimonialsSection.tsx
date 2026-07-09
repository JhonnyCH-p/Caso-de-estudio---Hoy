import React from 'react';

const TESTIMONIALS = [
   { avatar: '👨‍💼', name: 'Carlos Mendoza', role: 'Comprador SUV Familiar', text: 'La atención en Guayaquil fue impecable. Coticé en línea en la noche y al día siguiente me ayudaron a tramitar el crédito de manera inmediata. ¡Recomendados totalmente!' },
   { avatar: '👩‍⚕️', name: 'Diana Alvear', role: 'Propietaria Sedán Ejecutivo', text: 'Me encantó la transparencia en la tabla de amortización. El cotizador web da valores idénticos a los reales, sin costos ocultos ni sorpresas en las cuotas.' },
   { avatar: '👨‍💻', name: 'Javier Solórzano', role: 'Usuario Deportivo Apex', text: 'El proceso de compra en 4 pasos realmente desmitifica el dolor de cabeza que es comprar un carro. Rápido, claro y con una excelente tasa preferencial.' },
];

export const TestimonialsSection: React.FC = () => {
   return (
      <section className="bg-[#080e1a] py-16 px-10">
         <h2 className="text-center text-3xl font-bold text-white mb-3">Lo Que Dicen Nuestros Clientes</h2>
         <p className="text-center text-slate-400 max-w-[650px] mx-auto mb-12">
            La confianza y satisfacción de quienes ya manejan un AutoVentas Pro nos respaldan.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TESTIMONIALS.map(t => (
               <div key={t.name} className="bg-[#111c38] border border-[#1e2d50] rounded-xl p-7 shadow-sm flex flex-col gap-4 hover:shadow-md hover:shadow-blue-900/20 hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-3.5">
                     <div className="text-3xl bg-[#0a1225] w-12 h-12 rounded-full flex items-center justify-center">{t.avatar}</div>
                     <div>
                        <h4 className="text-white font-bold">{t.name}</h4>
                        <p className="text-slate-400 text-xs font-medium">{t.role}</p>
                     </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex gap-1 text-yellow-400 text-sm mt-auto">
                     {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
};
