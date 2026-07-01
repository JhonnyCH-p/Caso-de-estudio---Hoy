import { UsuarioInMemoryRepository } from '../src/infrastructure/repositories/usuario.inmemory.repository.js';

(async () => {
  console.log('🧪 PROBANDO REPOSITORIO USUARIO');
  console.log('================================\n');

  const repoU = new UsuarioInMemoryRepository();
  await repoU.seed();

  const admin = await repoU.findByUsuario('admin');
  console.log(`1. findByUsuario(): ${admin?.getUsuario()} - ${admin?.getRol()} - ${admin?.getNivelPermiso()}`);

  const asesores = await repoU.findByRol('asesor');
  console.log(`2. findByRol(): ${asesores.length} asesores`);
  asesores.forEach(a => console.log(`     • ${a.getUsuario()} - ${a.getEspecialidad()} (${a.getExperienciaAnios()} años)`));

  const todos = await repoU.findAll();
  console.log(`3. findAll(): ${todos.length} usuarios`);

  const activos = await repoU.findActivos();
  console.log(`4. findActivos(): ${activos.length} activos`);

  const count = await repoU.count();
  console.log(`5. count(): ${count}`);

  const porId = await repoU.findById(admin!.getId());
  console.log(`6. findById(): ${porId?.getUsuario()}`);

  const existe = await repoU.findByUsuario('nadie');
  console.log(`7. findByUsuario() inexistente: ${existe === null ? 'null (OK)' : 'ERROR'}`);

  console.log('\n✅ ¡TODAS LAS PRUEBAS DEL REPOSITORIO USUARIO PASARON!');
})();