import { AsesorRepositoryImpl } from '../src/infrastructure/repositories/AsesorRepositoryImpl.js';
import { Asesor } from '../src/domain/entities/Asesor.js';

(async () => {
  console.log('🧪 PROBANDO REPOSITORIO ASESOR (MEMORIA)');
  console.log('==========================================\n');

  const repo = new AsesorRepositoryImpl();
  // Limpiar el repositorio antes de empezar
  repo.clear();

  try {
    // 1. Guardar asesores
    console.log('1. save() - Guardar asesores');
    const a1 = Asesor.create('Vehículos Eléctricos', 8, 50000);
    const a2 = Asesor.create('Financiamiento', 3, 30000);
    const a3 = Asesor.create('Vehículos de Lujo', 12, 80000);
    await repo.save(a1);
    await repo.save(a2);
    await repo.save(a3);
    console.log(`   Guardados: ${await repo.count()} asesores\n`);

    // 2. findById
    console.log('2. findById()');
    const found = await repo.findById(a1.getId());
    console.log(`   Encontrado: ${found?.getEspecialidad()} (ID: ${found?.getId()})\n`);

    // 3. findAll
    console.log('3. findAll()');
    const all = await repo.findAll();
    console.log(`   Total: ${all.length}`);
    all.forEach(a => console.log(`   - ${a.getEspecialidad()} | meta: $${a.getMetaMensual()}`));
    console.log('');

    // 4. findByEspecialidad (búsqueda parcial)
    console.log('4. findByEspecialidad() - contiene "Vehículos"');
    const porEsp = await repo.findByEspecialidad('Vehículos');
    console.log(`   Encontrados: ${porEsp.length}`);
    porEsp.forEach(a => console.log(`   - ${a.getEspecialidad()}`));
    console.log('');

    // 5. findByExperienciaMinima
    console.log('5. findByExperienciaMinima() - ≥ 5 años');
    const porExp = await repo.findByExperienciaMinima(5);
    console.log(`   Encontrados: ${porExp.length}`);
    porExp.forEach(a => console.log(`   - ${a.getEspecialidad()} (${a.getExperienciaAnios()} años)`));
    console.log('');

    // 6. update
    console.log('6. update()');
    a1.changeMetaMensual(60000);
    a1.changeExperienciaAnios(9);
    await repo.update(a1);
    const updated = await repo.findById(a1.getId());
    console.log(`   Meta actualizada: $${updated?.getMetaMensual()}`);
    console.log(`   Experiencia actualizada: ${updated?.getExperienciaAnios()} años\n`);

    // 7. delete
    console.log('7. delete()');
    const deleted = await repo.delete(a2.getId());
    console.log(`   Eliminado: ${deleted}`);
    console.log(`   Quedan: ${await repo.count()} asesores\n`);

    // 8. existsById
    console.log('8. existsById()');
    const existe1 = await repo.existsById(a1.getId());
    const existe2 = await repo.existsById(a2.getId());
    console.log(`   Existe ${a1.getId()}? ${existe1 ? 'Sí' : 'No'}`);
    console.log(`   Existe ${a2.getId()}? ${existe2 ? 'Sí' : 'No'}\n`);

    // 9. Probar seed() (si existe)
    console.log('9. seed() - cargar datos de ejemplo');
    await repo.seed();
    console.log(`   Después de seed: ${await repo.count()} asesores\n`);

    console.log('✅ ¡TODAS LAS PRUEBAS DEL REPOSITORIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();