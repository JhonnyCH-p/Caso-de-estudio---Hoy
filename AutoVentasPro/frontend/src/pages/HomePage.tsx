import React from 'react';
import { useVehiculos } from '../hooks/useVehiculos';
import { HeroBanner } from '../components/HeroBanner';
import { CarCatalog } from '../components/CarCatalog';
import { BenefitsSection } from '../components/BenefitsSection';
import { ProcessSection } from '../components/ProcessSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FooterSection } from '../components/FooterSection';

export const HomePage: React.FC = () => {
   const { vehiculos, loading } = useVehiculos();

   return (
      <div>
         <HeroBanner />
         <CarCatalog vehiculos={vehiculos} loading={loading} />
         <BenefitsSection />
         <ProcessSection />
         <TestimonialsSection />
         <FooterSection />
      </div>
   );
};
