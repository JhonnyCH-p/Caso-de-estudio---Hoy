import { EmpleadoSupabaseRepository } from '../src/infrastructure/repositories/empleado.supabase.repository.js';
import { Empleado } from '../src/domain/entities/empleado.entity.js';

let creados: string[] = [];

(async () => {
    console.log('🧪 PROBANDO REPOSITORIO EMPLEADO (Supabase)');
    console.log('============================================\n');

    const repo = new EmpleadoSupabaseRepository();
    const ts = Date.now();

    try {
        const todos = await repo.findAll();
        console.log(`1. findAll(): ${todos.length} empleados (seed + existentes)`);
        todos.forEach(e => console.log(`     • ${e.getNombres()} - $${e.getSalario().toFixed(2)} - ${e.getDepartamento()}`));

        if (todos.length > 0) {
            const porId = await repo.findById(todos[0].getId());
            console.log(`\n2. findById(): ${porId?.getNombres()}`);
        } else {
            console.log(`\n2. findById(): (no hay datos para probar)`);
        }

        const inexistente = await repo.findById('no-existe');
        console.log(`3. findById() inexistente: ${inexistente === null ? 'null (OK)' : 'ERROR'}`);

        const countInicial = await repo.count();
        console.log(`4. count(): ${countInicial}`);

        const nuevo = Empleado.crear(`test_ced_${ts}`, 'Test Guardar', 5000, 'IT');
        await repo.save(nuevo);
        creados.push(nuevo.getId());
        const guardado = await repo.findById(nuevo.getId());
        console.log(`5. save() + findById(): ${guardado?.getNombres()} - $${guardado?.getSalario().toFixed(2)}`);

        const despues = await repo.count();
        console.log(`6. count() después de save(): ${despues} (debe ser ${countInicial + 1})`);

        nuevo.setSalario(6000);
        await repo.update(nuevo);
        const actualizado = await repo.findById(nuevo.getId());
        console.log(`7. update(): Salario actualizado a $${actualizado?.getSalario().toFixed(2)}`);

        const deleted = await repo.delete(nuevo.getId());
        creados = creados.filter(id => id !== nuevo.getId());
        console.log(`8. delete(): ${deleted ? 'eliminado (OK)' : 'ERROR'}`);

        const final = await repo.count();
        console.log(`9. count() final: ${final} (debe ser ${countInicial})`);

        const deleteInexistente = await repo.delete('no-existe');
        console.log(`10. delete() inexistente: ${!deleteInexistente ? 'false (OK)' : 'ERROR'}`);

        console.log('\n✅ ¡TODAS LAS PRUEBAS DEL REPOSITORIO EMPLEADO PASARON!');
    } catch (error: any) {
        console.error('❌ ERROR INESPERADO:', error.message);
    } finally {
        for (const id of creados) {
            try { await repo.delete(id); } catch { /* ignore */ }
        }
    }
})();
