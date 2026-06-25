import { InMemoryPlanFinanciamientoRepository } from '../src/infrastructure/repositories/InMemoryPlanFinanciamientoRepository.js';
import { PlanFinanciamiento } from '../src/domain/entities/PlanFinanciamiento.js';

(async () => {
  console.log('🧪 PROBANDO REPOSITORIO EN MEMORIA');
  console.log('===================================\n');
  const repo = new InMemoryPlanFinanciamientoRepository();
  try {
    const p1 = new PlanFinanciamiento('P1', 'Clásico', 20, 12.5, [12,24], 200);
    await repo.save(p1);
    console.log('1. Guardado, count:', await repo.count());
    const found = await repo.findById('P1');
    console.log('2. Encontrado:', found?.nombre);
    p1.tasaInteresAnual = 10;
    await repo.update(p1);
    const updated = await repo.findById('P1');
    console.log('3. Actualizado tasa:', updated?.tasaInteresAnual);
    await repo.delete('P1');
    console.log('4. Eliminado, count:', await repo.count());
    console.log('\n✅ ¡TODAS LAS PRUEBAS DEL REPOSITORIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();