import { Asesor } from '../src/domain/entities/Asesor.js';

(async () => {
  console.log('🧪 PROBANDO ENTIDAD ASESOR');
  console.log('==========================\n');

  try {
    // 1. Crear asesor con método estático create()
    console.log('1. Crear asesor con create()');
    const asesor = Asesor.create('Vehículos Eléctricos', 8, 50000);
    console.log(`   Creado: ${asesor.getEspecialidad()} | ID: ${asesor.getId()}`);
    console.log(`   Experiencia: ${asesor.getExperienciaAnios()} años`);
    console.log(`   Meta: $${asesor.getMetaMensual()}`);
    console.log(`   Creado: ${asesor.getCreatedAt().toISOString()}`);
    console.log(`   Actualizado: ${asesor.getUpdatedAt().toISOString()}\n`);

    // 2. Probar getters
    console.log('2. Getters funcionan correctamente');
    console.log(`   ID: ${asesor.getId()}`);
    console.log(`   Especialidad: ${asesor.getEspecialidad()}`);
    console.log(`   Experiencia: ${asesor.getExperienciaAnios()}`);
    console.log(`   Meta: ${asesor.getMetaMensual()}`);
    console.log(`   CreatedAt: ${asesor.getCreatedAt().toISOString()}`);
    console.log(`   UpdatedAt: ${asesor.getUpdatedAt().toISOString()}\n`);

    // 3. Calcular comisión
    console.log('3. Calcular comisión (venta $70,000)');
    const comision = asesor.calcularComision(70000);
    console.log(`   Comisión: $${comision}`);
    console.log('   Calcular comisión (venta $25,000 - bajo la meta)');
    const comisionBaja = asesor.calcularComision(25000);
    console.log(`   Comisión: $${comisionBaja}\n`);

    // 4. Cambiar especialidad
    console.log('4. changeEspecialidad()');
    asesor.changeEspecialidad('Vehículos Híbridos');
    console.log(`   Nueva especialidad: ${asesor.getEspecialidad()}`);
    console.log(`   UpdatedAt actualizado: ${asesor.getUpdatedAt().toISOString()}\n`);

    // 5. Cambiar años de experiencia
    console.log('5. changeExperienciaAnios()');
    asesor.changeExperienciaAnios(10);
    console.log(`   Nueva experiencia: ${asesor.getExperienciaAnios()} años\n`);

    // 6. Cambiar meta mensual
    console.log('6. changeMetaMensual()');
    asesor.changeMetaMensual(60000);
    console.log(`   Nueva meta: $${asesor.getMetaMensual()}\n`);

    // 7. toJSON()
    console.log('7. toJSON()');
    const json = asesor.toJSON();
    console.log(`   JSON: ${JSON.stringify(json, null, 2)}\n`);

    // 8. toString()
    console.log('8. toString()');
    console.log(`   ${asesor.toString()}\n`);

    // 9. Validaciones (deben lanzar error)
    console.log('9. Validaciones (datos inválidos)');
    try {
      Asesor.create('AB', 8, 50000); // especialidad muy corta
    } catch (error: any) {
      console.log(`   Error en especialidad corta: ${error.message}`);
    }
    try {
      Asesor.create('Válida', -1, 50000); // experiencia negativa
    } catch (error: any) {
      console.log(`   Error en experiencia negativa: ${error.message}`);
    }
    try {
      Asesor.create('Válida', 8, 0); // meta <= 0
    } catch (error: any) {
      console.log(`   Error en meta cero: ${error.message}`);
    }
    try {
      asesor.changeEspecialidad('XY'); // especialidad corta en cambio
    } catch (error: any) {
      console.log(`   Error al cambiar especialidad corta: ${error.message}`);
    }
    try {
      asesor.changeExperienciaAnios(-5);
    } catch (error: any) {
      console.log(`   Error al cambiar experiencia negativa: ${error.message}`);
    }
    try {
      asesor.changeMetaMensual(0);
    } catch (error: any) {
      console.log(`   Error al cambiar meta cero: ${error.message}`);
    }

    console.log('\n✅ ¡TODAS LAS PRUEBAS DE ENTIDAD PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR INESPERADO:', error.message);
  }
})();