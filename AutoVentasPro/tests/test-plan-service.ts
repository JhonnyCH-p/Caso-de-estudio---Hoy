import { InMemoryPlanFinanciamientoRepository } from '../src/infrastructure/repositories/InMemoryPlanFinanciamientoRepository.js';
import { PlanFinanciamientoService } from '../src/application/services/PlanFinanciamientoService.js';

(async () => {
  console.log('🧪 PROBANDO SERVICIO');
  console.log('======================\n');
  const repo = new InMemoryPlanFinanciamientoRepository();
  const service = new PlanFinanciamientoService(repo);
  try {
    const plan = await service.crearPlan({
      nombre: 'Eco',
      entradaMinima: 15,
      tasaInteresAnual: 9,
      plazosDisponibles: [24,36],
      comision: 300
    });
    console.log('1. Creado:', plan.nombre);
    const lista = await service.listarPlanes();
    console.log('2. Total:', lista.length);
    const cuota = await service.calcularCuota(plan.idPlan, 15000, 24);
    console.log('3. Cuota:', cuota);
    console.log('\n✅ ¡TODAS LAS PRUEBAS DEL SERVICIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();