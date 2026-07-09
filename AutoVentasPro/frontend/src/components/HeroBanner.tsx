import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
   const navigate = useNavigate();

   return (
      <section className="relative w-full h-[500px] flex items-center justify-center text-center overflow-hidden">
         <div className="absolute inset-0 bg-[url('/resources/slider1.jpg')] bg-cover bg-center bg-no-repeat" />
         <div className="absolute inset-0 bg-gradient-to-r from-[#080e1a]/90 via-[#080e1a]/70 to-[#080e1a]/90 z-[1]" />
         <div className="relative z-[2] max-w-[800px] px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md leading-tight text-white">
               Encuentra tu Vehiculo Ideal
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 text-slate-300 drop-shadow max-w-[650px] mx-auto">
               Explora financiamientos personalizados con tasas preferenciales del mercado y estrena el coche de tus suenos hoy mismo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
               <button onClick={() => navigate('/cotizaciones')}
                  className="bg-blue-600 text-white px-9 py-3.5 rounded-lg font-semibold text-base shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                  Cotizar Ahora
               </button>
               <button onClick={() => navigate('/catalogo')}
                  className="bg-transparent text-white px-9 py-3.5 rounded-lg font-semibold text-base border-2 border-white/30 hover:border-white hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                  Ver Catalogo
               </button>
            </div>
         </div>
         <a href="https://wa.me/593990000000?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20veh%C3%ADculos" target="_blank" rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
         </a>
      </section>
   );
};
