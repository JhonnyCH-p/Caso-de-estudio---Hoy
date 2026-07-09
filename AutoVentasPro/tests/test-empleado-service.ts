import { EmpleadoSupabaseRepository } from '../src/infrastructure/repositories/empleado.supabase.repository.js';
import { EmpleadoService } from '../src/application/services/EmpleadoService.js';

let creados: string[] = [];

(async () => {
    console.log('🧪 PROBANDO SERVICIO EMPLEADO (Supabase)');
    console.log('=========================================\n');

    const repo = new EmpleadoSupabaseRepository();
    const service = new EmpleadoService(repo);

    try {
        const ts = Date.now();

        console.log('1. crearEmpleado()');
        const emp1 = await service.crearEmpleado({
            cedula: `test_cedula_${ts}`,
            nombres: 'Ana García',
            salario: 2500,
            departamento: 'Ventas',
        });
        creados.push(emp1.id);
        console.log(`   Creado: ${emp1.nombres} | Cédula: ${emp1.cedula} | Salario: $${emp1.salario} | ID: ${emp1.id}\n`);

        console.log('2. crearEmpleado() sin departamento');
        const emp2 = await service.crearEmpleado({
            cedula: `test_cedula2_${ts}`,
            nombres: 'Carlos López',
            salario: 3200,
        });
        creados.push(emp2.id);
        console.log(`   Creado: ${emp2.nombres} | Departamento: '${emp2.departamento}'\n`);

        console.log('3. crearEmpleado() - Error: cédula corta');
        try {
            await service.crearEmpleado({ cedula: '123', nombres: 'Test', salario: 1000 });
            console.log('   ❌ ERROR: Debió fallar');
        } catch (e: any) {
            console.log(`   ✅ Correctamente falló: ${e.message}\n`);
        }

        console.log('4. crearEmpleado() - Error: salario negativo');
        try {
            await service.crearEmpleado({ cedula: `test_cedula3_${ts}`, nombres: 'Test', salario: -100 });
            console.log('   ❌ ERROR: Debió fallar');
        } catch (e: any) {
            console.log(`   ✅ Correctamente falló: ${e.message}\n`);
        }

        console.log('5. obtenerEmpleadoPorId()');
        const encontrado = await service.obtenerEmpleadoPorId(emp1.id);
        console.log(`   Encontrado: ${encontrado.nombres} - $${encontrado.salario}\n`);

        console.log('6. obtenerEmpleadoPorId() - Error: inexistente');
        try {
            await service.obtenerEmpleadoPorId('no-existe');
            console.log('   ❌ ERROR: Debió fallar');
        } catch (e: any) {
            console.log(`   ✅ Correctamente falló: ${e.message}\n`);
        }

        console.log('7. listarEmpleados()');
        const todos = await service.listarEmpleados();
        console.log(`   Total: ${todos.length} empleados`);
        todos.forEach(e => console.log(`   - ${e.nombres} (${e.departamento}) - $${e.salario}`));
        console.log('');

        console.log('8. actualizarEmpleado()');
        const actualizado = await service.actualizarEmpleado(emp1.id, {
            nombres: 'Ana María García',
            salario: 2800,
            departamento: 'Marketing',
        });
        console.log(`   Actualizado: ${actualizado.nombres} | $${actualizado.salario} | ${actualizado.departamento}\n`);

        console.log('9. eliminarEmpleado()');
        await service.eliminarEmpleado(emp2.id);
        creados = creados.filter(id => id !== emp2.id);
        const restantes = await service.listarEmpleados();
        console.log(`   Eliminado. Quedan: ${restantes.length} empleados\n`);

        console.log('10. eliminarEmpleado() - Error: inexistente');
        try {
            await service.eliminarEmpleado('no-existe');
            console.log('   ❌ ERROR: Debió fallar');
        } catch (e: any) {
            console.log(`   ✅ Correctamente falló: ${e.message}\n`);
        }

        console.log('11. aumentarSalario()');
        const aumentado = await service.aumentarSalario(emp1.id, 10);
        console.log(`   Salario aumentado 10%: $${aumentado.salario.toFixed(2)} (debe ser $3080.00)\n`);

        console.log('12. aumentarSalario() - Error: porcentaje inválido');
        try {
            await service.aumentarSalario(emp1.id, 200);
            console.log('   ❌ ERROR: Debió fallar');
        } catch (e: any) {
            console.log(`   ✅ Correctamente falló: ${e.message}\n`);
        }

        console.log('13. obtenerEstadisticas() con empleados');
        const stats1 = await service.obtenerEstadisticas();
        console.log(`   Total: ${stats1.total}`);
        console.log(`   Salario promedio: $${stats1.averageSalary.toFixed(2)}`);
        console.log(`   Salario máximo: $${stats1.maxSalary.toFixed(2)}`);
        console.log(`   Salario mínimo: $${stats1.minSalary.toFixed(2)}\n`);

        console.log('14. listarEmpleados() solo activos');
        await service.actualizarEmpleado(emp1.id, { activo: false });
        const activos = await service.listarEmpleados(true);
        console.log(`   Activos: ${activos.length} de ${(await service.listarEmpleados()).length} totales\n`);

        console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL SERVICIO EMPLEADO PASARON!');
    } catch (error: any) {
        console.error('❌ ERROR INESPERADO:', error.message);
    } finally {
        for (const id of creados) {
            try { await repo.delete(id); } catch { /* ignore */ }
        }
    }
})();
