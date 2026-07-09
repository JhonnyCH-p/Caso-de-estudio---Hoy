import { Cotizacion } from '../src/domain/entities/Cotizacion.js';
import { ClienteInfo } from '../src/domain/value-objects/ClienteInfo.js';
import { TablaAmortizacion } from '../src/domain/value-objects/TablaAmortizacion.js';

let pasaron = 0, fallaron = 0;
function assert(c: boolean, d: string) { if (c) { pasaron++; console.log(`   ✅ ${d}`); } else { fallaron++; console.log(`   ❌ ${d}`); } }
function assertError(fn: () => void, d: string) { try { fn(); fallaron++; console.log(`   ❌ ${d}`); } catch { pasaron++; console.log(`   ✅ ${d}`); } }

console.log('🧪 Test: Cotizacion + ClienteInfo + TablaAmortizacion\n');

const cliente = new ClienteInfo({ nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '0999999999', cedula: '1234567890', ciudad: 'Quito' });
assert(cliente.getNombre() === 'Juan Pérez', 'ClienteInfo: nombre');
assert(cliente.getEmail() === 'juan@email.com', 'ClienteInfo: email');

assertError(() => new ClienteInfo({ nombre: '', email: 'a@b.com', telefono: '123', cedula: '1234567890', ciudad: 'Quito' }), 'ClienteInfo: nombre vacio');
assertError(() => new ClienteInfo({ nombre: 'Juan', email: 'invalido', telefono: '123', cedula: '1234567890', ciudad: 'Quito' }), 'ClienteInfo: email invalido');

const tabla = TablaAmortizacion.generar(20000, 8.5, 24, 908.97);
assert(tabla.getFilas().length === 24, 'Tabla: 24 filas');
assert(tabla.getTotalIntereses() > 0, 'Tabla: total intereses > 0');
assert(tabla.getTotalPagado() > 20000, 'Tabla: total pagado > monto');

const cotizacion = Cotizacion.crear('vehiculo-1', 'plan-1', cliente, 25000, 5000, 24, 8.5, 908.97, tabla);
assert(cotizacion.getVehiculoId() === 'vehiculo-1', 'Cotizacion: vehiculoId');
assert(cotizacion.getPlanId() === 'plan-1', 'Cotizacion: planId');
assert(cotizacion.getMontoFinanciado() === 20000, 'Cotizacion: monto = precio - entrada');
assert(cotizacion.getCuotaMensual() === 908.97, 'Cotizacion: cuota mensual');
assert(cotizacion.getEstado() === 'PENDIENTE', 'Cotizacion: estado inicial PENDIENTE');
assert(cotizacion.estaPendiente() === true, 'Cotizacion: está pendiente');

cotizacion.aprobar();
assert(cotizacion.getEstado() === 'APROBADA', 'Cotizacion: aprobar');
assert(cotizacion.estaAprobada() === true, 'Cotizacion: está aprobada');

const json = cotizacion.toJSON();
assert(json.clienteNombre === 'Juan Pérez', 'toJSON: clienteNombre');
assert(json.estado === 'APROBADA', 'toJSON: estado');

const reconstruida = Cotizacion.desdeDatos(json);
assert(reconstruida.getCuotaMensual() === 908.97, 'desdeDatos: cuota');

assertError(() => Cotizacion.crear('', 'plan-1', cliente, 25000, 5000, 24, 8.5, 908.97, tabla), 'Validar: vehiculoId vacío');
assertError(() => Cotizacion.crear('v-1', '', cliente, 25000, 5000, 24, 8.5, 908.97, tabla), 'Validar: planId vacío');
assertError(() => Cotizacion.crear('v-1', 'p-1', cliente, 0, 0, 24, 8.5, 908.97, tabla), 'Validar: precio <= 0');

console.log(`\n📊 Resultados: ${pasaron} pasaron, ${fallaron} fallaron, ${pasaron + fallaron} total`);
