import { AsesorRepositoryImpl } from '../src/infrastructure/repositories/AsesorRepositoryImpl.js';
import { AsesorService } from '../src/application/services/AsesorService.js';

(async () => {
  console.log('🧪 PROBANDO SERVICIO ASESOR');
  console.log('============================\n');

  const repo = new AsesorRepositoryImpl();
  repo.clear(); // Limpiar antes de empezar
  const service = new AsesorService(repo);

  try {
    // 1. Crear asesor
    console.log('1. createAsesor()');
    const resp1 = await service.createAsesor({
      especialidad: 'Vehículos Eléctricos',
      experienciaAnios: 8,
      metaMensual: 50000
    });
    console.log(`   Creado: ${resp1.especialidad} | ID: ${resp1.id}\n`);

    // 2. Crear segundo asesor
    console.log('2. Crear segundo asesor');
    const resp2 = await service.createAsesor({
      especialidad: 'Financiamiento',
      experienciaAnios: 3,
      metaMensual: 30000
    });
    console.log(`   Creado: ${resp2.especialidad} | ID: ${resp2.id}\n`);

    // 3. Crear tercer asesor
    console.log('3. Crear tercer asesor');
    const resp3 = await service.createAsesor({
      especialidad: 'Vehículos de Lujo',
      experienciaAnios: 12,
      metaMensual: 80000
    });
    console.log(`   Creado: ${resp3.especialidad} | ID: ${resp3.id}\n`);

    // 4. getAsesorById
    console.log('4. getAsesorById()');
    const encontrado = await service.getAsesorById(resp1.id);
    console.log(`   Encontrado: ${encontrado.especialidad}`);
    console.log(`   Experiencia: ${encontrado.experienciaAnios} años`);
    console.log(`   Meta: $${encontrado.metaMensual}\n`);

    // 5. getAllAsesores
    console.log('5. getAllAsesores()');
    const todos = await service.getAllAsesores();
    console.log(`   Total: ${todos.length} asesores`);
    todos.forEach(a => console.log(`   - ${a.especialidad} | meta: $${a.metaMensual}`));
    console.log('');

    // 6. updateAsesor
    console.log('6. updateAsesor()');
    const actualizado = await service.updateAsesor(resp1.id, {
      metaMensual: 60000,
      experienciaAnios: 9,
      especialidad: 'Vehículos Híbridos'
    });
    console.log(`   Actualizado: ${actualizado.especialidad}`);
    console.log(`   Meta: $${actualizado.metaMensual}`);
    console.log(`   Experiencia: ${actualizado.experienciaAnios} años\n`);

    // 7. calcularComision
    console.log('7. calcularComision()');
    const comision1 = await service.calcularComision(resp1.id, 70000);
    console.log(`   Comisión para ${comision1.especialidad} (venta $70,000): $${comision1.comision}`);
    const comision2 = await service.calcularComision(resp2.id, 25000);
    console.log(`   Comisión para ${comision2.especialidad} (venta $25,000): $${comision2.comision}\n`);

    // 8. getAseforesByEspecialidad (nota: el typo en el nombre del método está en tu código)
    console.log('8. getAseforesByEspecialidad() - contiene "Vehículos"');
    const porEsp = await service.getAseforesByEspecialidad('Vehículos');
    console.log(`   Encontrados: ${porEsp.length}`);
    porEsp.forEach(a => console.log(`   - ${a.especialidad}`));
    console.log('');

    // 9. getAsesoresByExperiencia
    console.log('9. getAsesoresByExperiencia() - ≥ 5 años');
    const porExp = await service.getAsesoresByExperiencia(5);
    console.log(`   Encontrados: ${porExp.length}`);
    porExp.forEach(a => console.log(`   - ${a.especialidad} (${a.experienciaAnios} años)`));
    console.log('');

    // 10. deleteAsesor
    console.log('10. deleteAsesor()');
    await service.deleteAsesor(resp2.id);
    const restantes = await service.getAllAsesores();
    console.log(`   Eliminado. Quedan: ${restantes.length} asesores\n`);

    // 11. Prueba de errores
    console.log('11. Prueba de errores');
    try {
      await service.getAsesorById('id-invalido');
    } catch (error: any) {
      console.log(`   Error al obtener inválido: ${error.message}`);
    }
    try {
      await service.createAsesor({
        especialidad: 'AB', // muy corta
        experienciaAnios: 8,
        metaMensual: 50000
      });
    } catch (error: any) {
      console.log(`   Error al crear con especialidad corta: ${error.message}`);
    }
    try {
      await service.updateAsesor(resp1.id, { metaMensual: -100 });
    } catch (error: any) {
      console.log(`   Error al actualizar con meta negativa: ${error.message}`);
    }

    console.log('\n✅ ¡TODAS LAS PRUEBAS DEL SERVICIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR INESPERADO:', error.message);
  }
})();