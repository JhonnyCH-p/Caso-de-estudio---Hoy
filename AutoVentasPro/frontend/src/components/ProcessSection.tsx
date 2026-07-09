import React from 'react';

const STEPS = [
   { num: 1, title: 'Explora y Elige', desc: 'Navega en nuestro catálogo y selecciona el modelo que se adapte perfectamente a tu estilo de vida.' },
   { num: 2, title: 'Simula tu Cuota', desc: 'Usa nuestro cotizador integrado para calcular tus pagos mensuales según el plazo y la entrada elegida.' },
   { num: 3, title: 'Pre-Aprobación', desc: 'Validamos tus datos de forma rápida para emitir tu certificado de crédito con las tasas preferenciales.' },
   { num: 4, title: '¡Estrena Tu Coche!', desc: 'Firma la documentación de propiedad, retira las llaves en concesionaria y empieza a disfrutar tu viaje.' },
];

export const ProcessSection: React.FC = () => {
   return (
      <section className="bg-[#0c1322] py-16 px-10">
         <h2 className="text-center text-3xl font-bold text-white mb-3">Tu Próximo Vehículo en 4 Pasos</h2>
         <p className="text-center text-slate-400 max-w-[650px] mx-auto mb-12">
            Un proceso ágil, transparente y sin complicaciones burocráticas.
         </p>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {STEPS.map(s => (
               <div key={s.num} className="bg-[#111c38] border border-[#1e2d50] rounded-xl p-8 text-center relative shadow-sm hover:shadow-md hover:shadow-blue-900/20 hover:-translate-y-1 transition-all">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">
                     {s.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-4 mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
               </div>
            ))}
         </div>
      </section>
   );
};
