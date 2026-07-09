// 📁 src/components/EmployeeModal.tsx

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface EmployeeModalProps {
   /** Controla si el modal está abierto */
   isOpen: boolean;
   /** Función para cerrar el modal */
   onClose: () => void;
   /** Contenido del modal (formulario) */
   children: React.ReactNode;
   /** Título del modal */
   title: string;
}

/**
 * Componente Modal reutilizable para empleados
 *
 * @example
 * ```tsx
 * <EmployeeModal
 *     isOpen={showForm}
 *     onClose={handleCloseModal}
 *     title="Nuevo Empleado"
 * >
 *     <EmployeeForm ... />
 * </EmployeeModal>
 * ```
 */
export const EmployeeModal: React.FC<EmployeeModalProps> = ({
   isOpen,
   onClose,
   children,
   title,
}) => {
   // Si el modal no está abierto, no renderiza nada
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         {/* Fondo oscuro (overlay) */}
         <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}></div>

         {/* Contenedor del modal (centrado) */}
         <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#0c1322] rounded-lg border border-[#1e2d50] shadow-xl max-w-md w-full p-6">
               {/* Header con título y botón cerrar */}
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">
                     {title}
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-slate-400 hover:text-slate-300 transition-colors"
                     aria-label="Cerrar modal">
                     <XMarkIcon className="h-6 w-6" />
                  </button>
               </div>

               {/* Contenido del modal */}
               {children}
            </div>
         </div>
      </div>
   );
};
