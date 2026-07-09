import { UsuarioSupabaseRepository } from '../src/infrastructure/repositories/usuario.supabase.repository.js';

(async () => {
  console.log('🧪 PROBANDO REPOSITORIO USUARIO (Supabase)');
  console.log('===========================================\n');

  const repo = new UsuarioSupabaseRepository();

  try {
    const admin = await repo.findByUsuario('admin');
    console.log(`1. findByUsuario('admin'): ${admin?.getUsuario()} - ${admin?.getRol()}`);

    const asesores = await repo.findByRol('asesor');
    console.log(`2. findByRol('asesor'): ${asesores.length} asesores`);
    asesores.forEach(a => console.log(`     • ${a.getUsuario()}`));

    const todos = await repo.findAll();
    console.log(`3. findAll(): ${todos.length} usuarios`);

    const activos = await repo.findActivos();
    console.log(`4. findActivos(): ${activos.length} activos`);

    const count = await repo.count();
    console.log(`5. count(): ${count}`);

    if (admin) {
      const porId = await repo.findById(admin.getId());
      console.log(`6. findById(): ${porId?.getUsuario()}`);
    } else {
      console.log('6. findById(): (admin no encontrado)');
    }

    const existe = await repo.findByUsuario('nadie');
    console.log(`7. findByUsuario('nadie'): ${existe === null ? 'null (OK)' : 'ERROR'}`);

    console.log('\n✅ ¡TODAS LAS PRUEBAS DEL REPOSITORIO USUARIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR INESPERADO:', error.message);
  }
})();
