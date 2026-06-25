// src/test-vehiculo.ts
import { Vehiculo } from '../src/domain/entities/Vehiculo.js';

console.log('🧪 PROBANDO ENTIDAD VEHICULO');
console.log('============================\n');

try {
  // 1. Crear vehículo válido
  console.log('✅ Prueba 1: Crear vehículo válido');
  const vehiculo = Vehiculo.create(
    'Toyota',
    'Corolla',
    2024,
    25000,
    'SEDAN',
    5,
    { motor: '1.8L', transmision: 'Automática', color: 'Blanco', combustible: 'Gasolina' }
  );
  console.log('  Vehículo creado:', vehiculo.toString());
  console.log('  ID:', vehiculo.getId());
  console.log('  Stock:', vehiculo.getStock());
  console.log('  Disponible:', vehiculo.estaDisponible());
  console.log('');

  // 2. Actualizar precio usando el método genérico actualizar()
  console.log('✅ Prueba 2: Actualizar precio a 26000');
  vehiculo.actualizar({ precioBase: 26000 });
  console.log('  Nuevo precio:', vehiculo.getPrecioBase());
  console.log('');

  // 3. Ajustar stock (+3)
  console.log('✅ Prueba 3: Ajustar stock (+3)');
  vehiculo.ajustarStock(3);
  console.log('  Nuevo stock:', vehiculo.getStock());
  console.log('');

  // 4. Ajustar stock (-2)
  console.log('✅ Prueba 4: Ajustar stock (-2)');
  vehiculo.ajustarStock(-2);
  console.log('  Nuevo stock:', vehiculo.getStock());
  console.log('');

  // 5. Convertir a JSON
  console.log('✅ Prueba 5: toJSON()');
  const data = vehiculo.toJSON();
  console.log('  JSON:', JSON.stringify(data, null, 2));
  console.log('');

  // 6. Reconstruir desde datos
  console.log('✅ Prueba 6: Reconstruir desde datos');
  const vehiculo2 = Vehiculo.fromData(data);
  console.log('  Reconstruido:', vehiculo2.toString());
  console.log('  Precio:', vehiculo2.getPrecioBase());
  console.log('');

  // 7. Creación inválida (marca corta)
  console.log('✅ Prueba 7: Crear vehículo inválido (marca corta)');
  try {
    Vehiculo.create('T', 'Corolla', 2024, 25000, 'SEDAN', 5);
    console.log('  ❌ ERROR: Debió fallar');
  } catch (error: any) {
    console.log('  ✅ Correctamente falló:', error.message);
  }
  console.log('');

  // 8. Stock negativo
  console.log('✅ Prueba 8: Intentar stock negativo');
  try {
    vehiculo.ajustarStock(-10);
    console.log('  ❌ ERROR: Debió fallar');
  } catch (error: any) {
    console.log('  ✅ Correctamente falló:', error.message);
  }
  console.log('');

  // 9. Precio negativo
  console.log('✅ Prueba 9: Intentar precio negativo');
  try {
    vehiculo.actualizar({ precioBase: -1000 });
    console.log('  ❌ ERROR: Debió fallar');
  } catch (error: any) {
    console.log('  ✅ Correctamente falló:', error.message);
  }

} catch (error: any) {
  console.error('❌ ERROR INESPERADO:', error.message);
}