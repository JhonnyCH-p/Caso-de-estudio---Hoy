import { Empleado } from '../src/domain/entities/empleado.entity';

console.log('🧪 PROBANDO ENTIDAD EMPLEADO');
console.log('============================\n');

try {
    console.log('📌 Prueba 1: Crear empleado');
    const emp1 = Empleado.crear('1234567890', 'Ana García', 2500, 'Ventas');
    console.log(`✅ Creado: ${emp1.toString()}`);
    console.log(`   Cédula: ${emp1.getCedula()}`);
    console.log(`   Departamento: ${emp1.getDepartamento()}`);
    console.log(`   Activo: ${emp1.isActivo()}`);
    console.log('');

    console.log('📌 Prueba 2: Crear empleado sin departamento');
    const emp2 = Empleado.crear('0987654321', 'Carlos López', 3200);
    console.log(`✅ Creado: ${emp2.toString()}`);
    console.log(`   Departamento (default): '${emp2.getDepartamento()}'`);
    console.log('');

    console.log('📌 Prueba 3: Setter nombres');
    emp1.setNombres('Ana María García');
    console.log(`   Nombres actualizados: ${emp1.getNombres()}`);
    console.log('');

    console.log('📌 Prueba 4: Setter salario');
    emp2.setSalario(3500);
    console.log(`   Salario actualizado: $${emp2.getSalario().toFixed(2)}`);
    console.log('');

    console.log('📌 Prueba 5: Activar/Desactivar');
    emp1.desactivar();
    console.log(`   Desactivado, activo? ${emp1.isActivo()}`);
    emp1.activar();
    console.log(`   Reactivado, activo? ${emp1.isActivo()}`);
    console.log('');

    console.log('📌 Prueba 6: Aumentar salario');
    emp1.setSalario(2000);
    console.log(`   Salario antes: $${emp1.getSalario().toFixed(2)}`);
    emp1.aumentarSalario(10);
    console.log(`   Salario después (+10%): $${emp1.getSalario().toFixed(2)} (debe ser $2200.00)`);
    console.log('');

    console.log('📌 Prueba 7: Aumento inválido (>100)');
    try {
        emp1.aumentarSalario(150);
        console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 8: Cédula inválida');
    try {
        Empleado.crear('123', 'Test', 1000);
        console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 9: Nombres inválidos');
    try {
        Empleado.crear('1234567890', 'A', 1000);
        console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 10: Salario negativo');
    try {
        Empleado.crear('1234567890', 'Test', -100);
        console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 11: toJSON y desdeDatos');
    const json = emp2.toJSON();
    console.log(`   JSON: ${JSON.stringify(json, null, 2)}`);
    const reconstruido = Empleado.desdeDatos(json);
    console.log(`   Reconstruido: ${reconstruido.toString()}`);
    console.log(`   IDs iguales? ${emp2.getId() === reconstruido.getId()}`);
    console.log('');

    console.log('📌 Prueba 12: updatedAt cambia al modificar');
    const antes = emp1.getUpdatedAt();
    emp1.setDepartamento('Marketing');
    const despues = emp1.getUpdatedAt();
    console.log(`   UpdatedAt cambió? ${antes !== despues}`);
    console.log('');

} catch (e: any) {
    console.error('❌ ERROR INESPERADO:', e.message);
}

console.log('🎉 PRUEBAS DE ENTIDAD EMPLEADO COMPLETADAS');
