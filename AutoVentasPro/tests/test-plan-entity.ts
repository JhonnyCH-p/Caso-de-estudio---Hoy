import { PlanFinanciamiento } from '../src/domain/entities/PlanFinanciamiento.js';

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

console.log('🧪 Test: Entidad PlanFinanciamiento\n');

// 1. Crear plan válido
const p = PlanFinanciamiento.crear('Plan Básico', 20, 8.5, [12, 24, 36], 1);
assert(p.getNombre() === 'Plan Básico', 'Crear: nombre correcto');
assert(p.getEntradaMinima() === 20, 'Crear: entrada mínima correcta');
assert(p.getTasaInteresAnual() === 8.5, 'Crear: tasa interés correcta');
assert(JSON.stringify(p.getPlazosDisponibles()) === '[12,24,36]', 'Crear: plazos disponibles correctos');
assert(p.getComision() === 1, 'Crear: comisión correcta');
assert(p.isActivo() === true, 'Crear: activo por defecto');
assert(p.getId().startsWith('PLAN-'), 'Crear: ID con prefijo PLAN-');

// 2. Calcular cuota
const cuota = p.calcularCuota(20000, 24);
assert(cuota > 0, 'Calcular cuota: resultado positivo');
assert(typeof cuota === 'number', 'Calcular cuota: es número');

// 3. Calcular cuota con tasa 0%
const p0 = PlanFinanciamiento.crear('Plan 0%', 30, 0, [12, 24]);
const cuota0 = p0.calcularCuota(12000, 12);
assert(cuota0 === 1000, `Calcular cuota 0%: ${cuota0} === 1000`);

// 4. Setters
p.setNombre('Plan Premium');
assert(p.getNombre() === 'Plan Premium', 'Setter: nombre');
p.setTasaInteresAnual(4.5);
assert(p.getTasaInteresAnual() === 4.5, 'Setter: tasa interés');
p.setEntradaMinima(10);
assert(p.getEntradaMinima() === 10, 'Setter: entrada mínima');
p.setPlazosDisponibles([12, 24, 36, 48, 60]);
assert(p.getPlazosDisponibles().length === 5, 'Setter: plazos');
p.setComision(2);
assert(p.getComision() === 2, 'Setter: comisión');

// 5. Activar/Desactivar
p.desactivar();
assert(p.isActivo() === false, 'Desactivar');
p.activar();
assert(p.isActivo() === true, 'Activar');

// 6. toJSON / desdeDatos
const json = p.toJSON();
assert(json.nombre === 'Plan Premium', 'toJSON: nombre');
const reconstruido = PlanFinanciamiento.desdeDatos(json);
assert(reconstruido.getNombre() === p.getNombre(), 'desdeDatos: nombre');

// 7. Validaciones
assertError(() => PlanFinanciamiento.crear('', 20, 8.5, [12, 24]), 'Validar: nombre vacío');
assertError(() => PlanFinanciamiento.crear('Plan', -1, 8.5, [12, 24]), 'Validar: entrada mínima negativa');
assertError(() => PlanFinanciamiento.crear('Plan', 150, 8.5, [12, 24]), 'Validar: entrada mínima > 100');
assertError(() => PlanFinanciamiento.crear('Plan', 20, -1, [12, 24]), 'Validar: tasa negativa');
assertError(() => PlanFinanciamiento.crear('Plan', 20, 8.5, []), 'Validar: sin plazos');
assertError(() => PlanFinanciamiento.crear('Plan', 20, 8.5, [0]), 'Validar: plazo cero');
assertError(() => PlanFinanciamiento.crear('Plan', 20, 8.5, [12, 24], -1), 'Validar: comisión negativa');
assertError(() => p.calcularCuota(10000, 99), 'Validar: plazo no disponible');

console.log(`\n📊 Resultados: ${pasaron} pasaron, ${fallaron} fallaron, ${pasaron + fallaron} total`);
