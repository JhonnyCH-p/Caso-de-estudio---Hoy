import { UsuarioInMemoryRepository } from './domain/entities/usuario.inmemory.repository.js';

// Al final del archivo, después de las otras pruebas:

console.log('📌 REPOSITORIO USUARIO');
const repoU = new UsuarioInMemoryRepository();
await repoU.seed();

const admin = await repoU.findByUsuario('admin');
console.log(`   ✅ Admin: ${admin?.getUsuario()} - ${admin?.getRol()} - ${admin?.getNivelPermiso()}`);

const asesores = await repoU.findByRol('asesor');
console.log(`   ✅ Asesores: ${asesores.length}`);
asesores.forEach(a => console.log(`      • ${a.getUsuario()} - ${a.getEspecialidad()} (${a.getExperienciaAnios()} años)`));

const todos = await repoU.findAll();
console.log(`   ✅ Total usuarios: ${todos.length}`);

const activos = await repoU.findActivos();
console.log(`   ✅ Activos: ${activos.length}`);

const count = await repoU.count();
console.log(`   ✅ Count: ${count}`);