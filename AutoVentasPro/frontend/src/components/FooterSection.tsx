import React from 'react';

const SOCIAL_ICONS = [
   { name: 'Facebook', img: '/resources/Footer Icons/facebook.png', url: 'https://www.facebook.com' },
   { name: 'Instagram', img: '/resources/Footer Icons/instagram.png', url: 'https://www.instagram.com' },
   { name: 'Twitter / X', img: '/resources/Footer Icons/twitter.png', url: 'https://www.x.com' },
   { name: 'YouTube', img: '/resources/Footer Icons/youtube.png', url: 'https://www.youtube.com' },
   { name: 'LinkedIn', img: '/resources/Footer Icons/linkedin.png', url: 'https://www.linkedin.com' },
   { name: 'TikTok', img: '/resources/Footer Icons/tiktok.png', url: 'https://www.tiktok.com' },
];

const QUICK_LINKS = [
   { label: 'Inicio', to: '/home' },
   { label: 'Vehículos', to: '/vehiculos' },
   { label: 'Planes Financieros', to: '/planes' },
   { label: 'Cotizador', to: '/cotizaciones' },
   { label: 'Nosotros', to: '/home' },
];

const CONTACT_INFO = [
   { label: 'Dirección', value: 'Av. Francisco de Orellana y Dr. Miguel Albornoz, Edificio AutoVentas, Guayaquil - Ecuador', icon: '📍' },
   { label: 'Teléfonos', value: '+593 4 500 1234 / +593 99 000 0000', icon: '📞' },
   { label: 'Email', value: 'info@autoventaspro.com.ec', icon: '✉️' },
   { label: 'Horarios', value: 'Lun - Vie: 09:00 - 18:00 | Sáb: 09:00 - 13:00', icon: '🕐' },
];

export const FooterSection: React.FC = () => {
   return (
      <footer className="bg-[#050a14] text-slate-400 border-t border-[#1a2848]">
         <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <img src="/resources/AutoVentasProLogo.png" alt="AutoVentas Pro" className="h-10 w-auto" />
                  <span className="text-white text-xl font-bold">AutoVentas Pro</span>
               </div>
               <p className="text-sm leading-relaxed text-slate-500 mb-4">
                  Concesionaria automotriz líder en Guayaquil. Ofrecemos vehículos de alta calidad con planes de financiamiento flexibles.
               </p>
               <div className="flex gap-3">
                  {SOCIAL_ICONS.map(s => (
                     <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 bg-[#111c38] rounded-full hover:bg-blue-600 hover:-translate-y-0.5 transition-all">
                        <img src={s.img} alt={s.name} className="w-4 h-4 object-contain" />
                     </a>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="text-white font-bold text-base mb-4">Enlaces Rápidos</h3>
               <ul className="space-y-2.5">
                  {QUICK_LINKS.map(link => (
                     <li key={link.label}>
                        <a href={link.to}
                           className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                           <span className="text-blue-400 text-xs">▸</span> {link.label}
                        </a>
                     </li>
                  ))}
               </ul>
            </div>

            <div>
               <h3 className="text-white font-bold text-base mb-4">Contacto</h3>
               <ul className="space-y-3">
                  {CONTACT_INFO.map(info => (
                     <li key={info.label} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5">{info.icon}</span>
                        <div>
                           <span className="text-slate-500">{info.label}:</span>{' '}
                           <span className="text-slate-400">{info.value}</span>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>

            <div>
               <h3 className="text-white font-bold text-base mb-4">Ubicación</h3>
               <div className="rounded-lg overflow-hidden border border-[#1e2d50] mb-4 h-[150px] bg-[#0a1225]">
                  <iframe
                     title="Ubicación AutoVentas Pro"
                     src="https://www.openstreetmap.org/export/embed.html?bbox=-79.9068%2C-2.2020%2C-79.8868%2C-2.1820&amp;layer=mapnik&amp;marker=-2.1920%2C-79.8968"
                     width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
               </div>
               <div className="space-y-2">
                  <a href="#" className="block text-xs text-slate-600 hover:text-slate-300 transition-colors">Política de Privacidad</a>
                  <a href="#" className="block text-xs text-slate-600 hover:text-slate-300 transition-colors">Términos y Condiciones</a>
                  <a href="#" className="block text-xs text-slate-600 hover:text-slate-300 transition-colors">Política de Cookies</a>
               </div>
            </div>
         </div>

         <div className="border-t border-[#1a2848]">
            <div className="max-w-7xl mx-auto px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
               <p>&copy; {new Date().getFullYear()} AutoVentas Pro Cía. Ltda. Todos los derechos reservados.</p>
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">🔒 Certificado SSL</span>
                  <span className="flex items-center gap-1">⭐ Servicio Calificado</span>
               </div>
            </div>
         </div>
      </footer>
   );
};
