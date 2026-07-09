import { Venta } from '../src/domain/entities/Venta.js';

let pasaron = 0, fallaron = 0;
function assert(c: boolean, d: string) { if (c) { pasaron++; console.log(`   ✅ ${d}`); } else { fallaron++; console.log(`   ❌ ${d}`); } }
function assertError(fn: () => void, d: string) { try { fn(); fallaron++; console.log(`   ❌ ${d}`); } catch { pasaron++; console.log(`   ✅ ${d}`); } }

console.log('🧪 Test: Entidad Venta\n');

const v = Venta.crear('cotizacion-1', 'asesor-1', 25000);
assert(v.getCotizacionId() === 'cotizacion-1', 'Crear: cotizacionId');
assert(v.getAsesorId() === 'asesor-1', 'Crear: asesorId');
assert(v.getValorTotal() === 25000, 'Crear: valor total');
assert(v.getEstado() === 'PENDIENTE', 'Crear: estado inicial PENDIENTE');
assert(v.estaPendiente() === true, 'Crear: está pendiente');
assert(v.getId().startsWith('VEN-'), 'Crear: ID con prefijo VEN-');

v.aprobar();
assert(v.getEstado() === 'APROBADA', 'Aprobar: estado');
assert(v.estaAprobada() === true, 'Aprobar: está aprobada');

v.cancelar();
assert(v.getEstado() === 'CANCELADA', 'Cancelar');

// No puede aprobar si no está pendiente
const v2 = Venta.crear('cot-2', 'asesor-2', 30000);
v2.cancelar();
assertError(() => v2.aprobar(), 'Aprobar: solo pendientes');

// Rechazar
const v3 = Venta.crear('cot-3', 'asesor-3', 15000);
v3.rechazar();
assert(v3.getEstado() === 'RECHAZADA', 'Rechazar');

// toJSON / desdeDatos
const json = v.toJSON();
assert(json.estado === 'CANCELADA', 'toJSON: estado');
const reconstruida = Venta.desdeDatos(json);
assert(reconstruida.getEstado() === 'CANCELADA', 'desdeDatos: estado');

// Validaciones
assertError(() => Venta.crear('', 'asesor', 100), 'Validar: cotizacionId vacío');
assertError(() => Venta.crear('cot', '', 100), 'Validar: asesorId vacío');
assertError(() => Venta.crear('cot', 'asesor', -1), 'Validar: valor negativo');

console.log(`\n📊 Resultados: ${pasaron} pasaron, ${fallaron} fallaron, ${pasaron + fallaron} total`);
