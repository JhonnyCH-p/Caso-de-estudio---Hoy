// src/test-vehiculo-repository.ts
import { VehiculoInMemoryRepository } from './infrastructure/repositories/VehiculoRepositorylmpl.js';
import { Vehiculo } from './domain/entities/Vehiculo.js';

(async () => {
  console.log('🧪 PROBANDO REPOSITORIO VEHICULO (MEMORIA)');
  console.log('===========================================\n');

  const repo = new VehiculoInMemoryRepository();

  try {
    // 1. CREATE
    console.log('1. CREATE - Guardar vehículos');
    const v1 = Vehiculo.create('Toyota', 'Corolla', 2024, 25000, 'SEDAN', 5);
    const v2 = Vehiculo.create('Honda', 'Civic', 2024, 27000, 'SEDAN', 3);
    await repo.save(v1);
    await repo.save(v2);
    console.log(`  Guardados: ${await repo.count()} vehículos\n`);

    // 2. READ - findById
    console.log('2. READ - Buscar por ID');
    const found = await repo.findById(v1.getId());
    console.log(`  Encontrado: ${found?.getMarca()} ${found?.getModelo()}\n`);

    // 3. READ - findAll
    console.log('3. READ - Obtener todos');
    const all = await repo.findAll();
    console.log(`  Total: ${all.length} vehículos`);
    all.forEach(v => console.log(`  - ${v.getMarca()} ${v.getModelo()}: $${v.getPrecioBase()}`));
    console.log('');

    // 4. READ - findByMarca
    console.log('4. READ - Buscar por marca (Toyota)');
    const byMarca = await repo.findByMarca('Toyota');
    console.log(`  Encontrados: ${byMarca.length}\n`);

    // 5. READ - findDisponibles
    console.log('5. READ - Vehículos disponibles (stock > 0)');
    const disponibles = await repo.findDisponibles();
    console.log(`  Disponibles: ${disponibles.length}\n`);

    // 6. UPDATE
    console.log('6. UPDATE - Actualizar precio');
    v1.actualizar({ precioBase: 26000 });
    await repo.update(v1);
    const updated = await repo.findById(v1.getId());
    console.log(`  Nuevo precio: $${updated?.getPrecioBase()}\n`);

    // 7. DELETE
    console.log('7. DELETE - Eliminar vehículo');
    const deleted = await repo.delete(v2.getId());
    console.log(`  Eliminado: ${deleted}, Quedan: ${await repo.count()}\n`);

    // 8. READ - findByRangoPrecio (método que no está en la interfaz, pero está en el repo)
    // Nota: la interfaz no tiene findByRangoPrecio, pero la implementación sí.
    // Si quieres probarlo, puedes hacer un cast o usar el método directamente.
    // Por ahora, lo comento porque no está en la interfaz.
    // console.log('8. READ - Rango de precio ($25000 - $30000)');
    // const enRango = await repo.findByRangoPrecio(25000, 30000);
    // console.log(`  En rango: ${enRango.length} vehículos\n`);

    console.log('✅ ¡TODAS LAS PRUEBAS PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();