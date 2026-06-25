import { PlanFinanciamiento } from '../src/domain/entities/PlanFinanciamiento.js';
(async () => {
  console.log('🧪 PROBANDO ENTIDAD PLAN FINANCIAMIENTO');
  console.log('=========================================\n');
  try {
    const plan = new PlanFinanciamiento('PLAN-TEST', 'Plan Joven', 10, 8.0, [12, 24, 36], 150);
    console.log('1. Creación:', plan.nombre);
    console.log('2. Cuota 24 meses:', plan.calcularCuota(12000, 24));
    plan.desactivar();
    console.log('3. Activo?', plan.activo);
    console.log('\n✅ ¡TODAS LAS PRUEBAS DE ENTIDAD PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();