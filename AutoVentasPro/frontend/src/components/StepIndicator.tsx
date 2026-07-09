import React from 'react';

interface Step {
   num: number;
   label: string;
}

const STEPS: Step[] = [
   { num: 1, label: 'Elegir Vehiculo' },
   { num: 2, label: 'Simular Cuota' },
   { num: 3, label: 'Tus Datos' },
   { num: 4, label: 'Confirmacion' },
];

interface StepIndicatorProps {
   currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
   return (
      <div className="flex items-center justify-center gap-0 w-full max-w-3xl mx-auto mb-8">
         {STEPS.map((s, i) => {
            const isActive = s.num === currentStep;
            const isPast = s.num < currentStep;
            return (
               <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                     <div className={
                        'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ' +
                        (isPast
                           ? 'bg-blue-600 border-blue-600 text-white'
                           : isActive
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm shadow-blue-500/30'
                              : 'bg-[#0a1225] border-[#1e2d50] text-slate-500')
                     }>
                        {isPast ? (
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                           </svg>
                        ) : s.num}
                     </div>
                     <span className={
                        'text-[10px] mt-1.5 font-medium whitespace-nowrap transition-colors ' +
                        (isActive ? 'text-blue-400' : isPast ? 'text-slate-400' : 'text-slate-600')
                     }>
                        {s.label}
                     </span>
                  </div>
                  {i < STEPS.length - 1 && (
                     <div className={
                        'flex-1 h-0.5 mx-2 mt-[-18px] transition-colors ' +
                        (i < currentStep - 1 ? 'bg-blue-600' : 'bg-[#1e2d50]')
                     } />
                  )}
               </React.Fragment>
            );
         })}
      </div>
   );
};
