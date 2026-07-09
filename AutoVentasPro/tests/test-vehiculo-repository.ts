import { VehiculoSupabaseRepository } from '../src/infrastructure/repositories/vehiculo.supabase.repository.js';
import { Vehiculo } from '../src/domain/entities/Vehiculo.js';

let pasaron = 0;
let fallaron = 0;
let creados: string[] = [];

function assert(condicion: boolean, desc: string) {
    if (condicion) { pasaron++; console.log(`   ✅ ${desc}`); }
    else { fallaron++; console.log(`   ❌ ${desc}`); }
}

console.log('🧪 Test: VehiculoSupabaseRepository\n');

async function test() {
    const repo = new VehiculoSupabaseRepository();
    const ts = Date.now();

    try {
        const countInicial = await repo.count();
        console.log(`   (count inicial: ${countInicial})\n`);

        const v1 = Vehiculo.crear('Toyota', `Corolla_${ts}`, 2024, 25000, 'SEDAN', 5);
        const v2 = Vehiculo.crear('Honda', `CRV_${ts}`, 2024, 32000, 'SUV', 0);

        await repo.save(v1);
        creados.push(v1.getId());
        await repo.save(v2);
        creados.push(v2.getId());
        assert((await repo.count()) === countInicial + 2, 'save: 2 vehículos guardados');

        const encontrado = await repo.findById(v1.getId());
        assert(encontrado !== null, 'findById: encontrado');
        assert(encontrado!.getMarca() === 'Toyota', 'findById: marca correcta');

        const noEncontrado = await repo.findById('no-existe');
        assert(noEncontrado === null, 'findById: no existente retorna null');

        v1.setPrecioBase(26000);
        await repo.update(v1);
        const actualizado = await repo.findById(v1.getId());
        assert(actualizado!.getPrecioBase() === 26000, 'update: precio actualizado');

        let error = false;
        try {
            await repo.update(Vehiculo.crear('Test', 'Test', 2024, 100, 'SEDAN', 1));
        } catch { error = true; }
        assert(error, 'update: error si no existe');

        const todos = await repo.findAll();
        assert(todos.length >= 2, 'findAll: al menos 2 vehículos');

        const disponibles = await repo.findDisponibles();
        assert(disponibles.length >= 1, 'findDisponibles: al menos 1 disponible');
        const disponiblesConStock = disponibles.filter(d => d.getStock() > 0);
        assert(disponiblesConStock.length >= 1, 'findDisponibles: algunos con stock > 0');

        const eliminado = await repo.delete(v2.getId());
        creados = creados.filter(id => id !== v2.getId());
        assert(eliminado === true, 'delete: eliminado');
        assert((await repo.count()) === countInicial + 1, 'delete: count es countInicial + 1');

        const falso = await repo.delete('no-existe');
        assert(falso === false, 'delete: falso si no existe');

        console.log(`\n📊 Resultados: ${pasaron} pasaron, ${fallaron} fallaron, ${pasaron + fallaron} total`);
    } finally {
        for (const id of creados) {
            try { await repo.delete(id); } catch { /* ignore */ }
        }
    }
}

test().catch(e => { console.error('❌ Error:', e); process.exit(1); });
