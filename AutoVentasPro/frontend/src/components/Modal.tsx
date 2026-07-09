import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: React.ReactNode;
   title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
         <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-[#0c1322] border border-[#1e2d50] rounded-xl shadow-xl max-w-md w-full p-6">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                  <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Cerrar">
                     <XMarkIcon className="h-6 w-6" />
                  </button>
               </div>
               {children}
            </div>
         </div>
      </div>
   );
};
