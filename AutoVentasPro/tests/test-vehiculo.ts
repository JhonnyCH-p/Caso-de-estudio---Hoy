import { Vehiculo } from '../src/domain/entities/Vehiculo.js';

let pasaron = 0;
let fallaron = 0;

function assert(condicion: boolean, desc: string) {
    if (condicion) { pasaron++; console.log(`   ✅ ${desc}`); }
    else { fallaron++; console.log(`   ❌ ${desc}`); }
}

function assertError(fn: () => void, desc: string) {
    try { fn(); fallaron++; console.log(`   ❌ ${desc} (no lanzó error)`); }
    catch { pasaron++; console.log(`   ✅ ${desc}`); }
}

console.log('🧪 Test: Entidad Vehiculo\n');

// 1. Crear vehículo válido
const v = Vehiculo.crear('Toyota', 'Corolla', 2024, 25000, 'SEDAN', 5);
assert(v.getMarca() === 'Toyota', 'Crear: marca correcta');
assert(v.getModelo() === 'Corolla', 'Crear: modelo correcto');
assert(v.getAnio() === 2024, 'Crear: año correcto');
assert(v.getPrecioBase() === 25000, 'Crear: precio base correcto');
assert(v.getTipo() === 'SEDAN', 'Crear: tipo correcto');
assert(v.getStock() === 5, 'Crear: stock correcto');
assert(v.isActivo() === true, 'Crear: activo por defecto');
assert(v.estaDisponible() === true, 'Crear: disponible con stock');
assert(v.getId().startsWith('VEH-'), 'Crear: ID con prefijo VEH-');

// 2. Sin stock no disponible
const v2 = Vehiculo.crear('Honda', 'CR-V', 2024, 32000, 'SUV', 0);
assert(v2.estaDisponible() === false, 'Sin stock: no disponible');

// 3. Setters
v.setPrecioBase(26000);
assert(v.getPrecioBase() === 26000, 'Setter: precio base');
v.setMarca('Toyota Actualizado');
assert(v.getMarca() === 'Toyota Actualizado', 'Setter: marca');

// 4. Ajustar stock
v.ajustarStock(3);
assert(v.getStock() === 8, 'Ajustar stock: +3');
v.ajustarStock(-2);
assert(v.getStock() === 6, 'Ajustar stock: -2');

// 5. Activar/Desactivar
v.desactivar();
assert(v.isActivo() === false, 'Desactivar');
assert(v.estaDisponible() === false, 'Inactivo: no disponible');
v.activar();
assert(v.isActivo() === true, 'Activar');

// 6. toJSON
const json = v.toJSON();
assert(json.marca === 'Toyota Actualizado', 'toJSON: marca');
assert(json.activo === true, 'toJSON: activo');
assert(typeof json.createdAt === 'string', 'toJSON: createdAt string');

// 7. desdeDatos
const reconstruido = Vehiculo.desdeDatos(json);
assert(reconstruido.getMarca() === v.getMarca(), 'desdeDatos: marca');
assert(reconstruido.getPrecioBase() === v.getPrecioBase(), 'desdeDatos: precio');

// 8. Validaciones
assertError(() => Vehiculo.crear('T', 'Corolla', 2024, 25000, 'SEDAN', 5), 'Validar: marca corta');
assertError(() => Vehiculo.crear('Toyota', '', 2024, 25000, 'SEDAN', 5), 'Validar: modelo vacío');
assertError(() => Vehiculo.crear('Toyota', 'Corolla', 1899, 25000, 'SEDAN', 5), 'Validar: año inválido');
assertError(() => Vehiculo.crear('Toyota', 'Corolla', 2024, -100, 'SEDAN', 5), 'Validar: precio negativo');
assertError(() => Vehiculo.crear('Toyota', 'Corolla', 2024, 25000, 'INVALIDO', 5), 'Validar: tipo inválido');
assertError(() => v.ajustarStock(-100), 'Validar: stock insuficiente');

// 9. Especificaciones como string JSON
const v3 = Vehiculo.crear('Ford', 'Mustang', 2024, 55000, 'DEPORTIVO', 1, '{"motor":"5.0L"}');
assert(v3.getEspecificaciones() === '{"motor":"5.0L"}', 'Especificaciones: guarda string JSON');

// 10. Imagen
const v4 = Vehiculo.crear('Tesla', 'Model 3', 2024, 45000, 'SEDAN', 2, undefined, 'https://ejemplo.com/tesla.jpg');
assert(v4.getImagen() === 'https://ejemplo.com/tesla.jpg', 'Imagen: se guarda correctamente');
const v5 = Vehiculo.crear('Tesla', 'Model Y', 2024, 50000, 'SUV', 1);
assert(v5.getImagen() === null, 'Imagen: null si no se proporciona');
v5.setImagen('https://ejemplo.com/nueva.jpg');
assert(v5.getImagen() === 'https://ejemplo.com/nueva.jpg', 'setImagen: actualiza correctamente');
const json5 = v5.toJSON();
assert(json5.imagen === 'https://ejemplo.com/nueva.jpg', 'toJSON: incluye imagen');

console.log(`\n📊 Resultados: ${pasaron} pasaron, ${fallaron} fallaron, ${pasaron + fallaron} total`);
