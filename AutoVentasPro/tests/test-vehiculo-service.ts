// src/test-vehiculo-service.ts
import { VehiculoService } from '../src/application/services/VehiculoService.js';
import { VehiculoInMemoryRepository } from '../src/infrastructure/repositories/VehiculoRepositoryImpl.js';

(async () => {
  console.log('🧪 PROBANDO SERVICIO VEHICULO');
  console.log('===============================\n');

  const repo = new VehiculoInMemoryRepository();
  const service = new VehiculoService(repo);

  try {
    console.log('1. Crear vehículo');
    const creado = await service.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2024,
      precioBase: 25000,
      tipo: 'SEDAN',
      stock: 5,
    });
    console.log(`  Creado: ${creado.marca} ${creado.modelo} (ID: ${creado.id})`);
    console.log('');

    console.log('2. Obtener por ID');
    const encontrado = await service.getById(creado.id);
    console.log(`  Encontrado: ${encontrado.marca} ${encontrado.modelo} - $${encontrado.precioBase}`);
    console.log('');

    console.log('3. Actualizar vehículo (cambiar precio y stock)');
    const actualizado = await service.update(creado.id, {
      precioBase: 26000,
      stock: 8,
    });
    console.log(`  Nuevo precio: $${actualizado.precioBase}, Nuevo stock: ${actualizado.stock}`);
    console.log('');

    console.log('4. Listar todos los vehículos');
    const todos = await service.getAll();
    console.log(`  Total: ${todos.length} vehículos`);
    todos.forEach(v => console.log(`  - ${v.marca} ${v.modelo}: $${v.precioBase}`));
    console.log('');

    console.log('5. Obtener vehículos disponibles');
    const disponibles = await service.getDisponibles();
    console.log(`  Disponibles: ${disponibles.length}`);
    console.log('');

    console.log('6. Eliminar vehículo');
    await service.delete(creado.id);
    console.log('  Eliminado correctamente');
    console.log('');

    console.log('✅ ¡TODAS LAS PRUEBAS DEL SERVICE VEHICULO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
  }
})();