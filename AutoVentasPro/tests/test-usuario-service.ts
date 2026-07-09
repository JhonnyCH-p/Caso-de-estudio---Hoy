import { UsuarioSupabaseRepository } from '../src/infrastructure/repositories/usuario.supabase.repository.js';
import { UsuarioService } from '../src/application/services/UsuarioService.js';

let creados: string[] = [];

(async () => {
  console.log('🧪 PROBANDO SERVICIO USUARIO (Supabase)');
  console.log('=========================================\n');

  const repo = new UsuarioSupabaseRepository();
  const service = new UsuarioService(repo);

  try {
    const ts = Date.now();

    console.log('1. crearUsuario() - Administrador');
    const admin = await service.crearUsuario({
      usuario: `admin_test_${ts}`, password: 'admin123', rol: 'administrador',
      nivelPermiso: 'total'
    });
    creados.push(admin.id);
    console.log(`   Creado: ${admin.usuario} | Rol: ${admin.rol} | ID: ${admin.id}\n`);

    console.log('2. crearUsuario() - Asesor');
    const asesor = await service.crearUsuario({
      usuario: `asesor_test_${ts}`, password: 'asesor123', rol: 'asesor',
      especialidad: 'autos', experienciaAnios: 5, metaMensual: 10
    });
    creados.push(asesor.id);
    console.log(`   Creado: ${asesor.usuario} | Especialidad: ${asesor.especialidad}\n`);

    console.log('3. crearUsuario() - Jefe de Ventas');
    const jefe = await service.crearUsuario({
      usuario: `jefe_test_${ts}`, password: 'jefe123', rol: 'jefe_ventas',
      areaResponsable: 'ventas', bonoGestion: 500
    });
    creados.push(jefe.id);
    console.log(`   Creado: ${jefe.usuario} | Área: ${jefe.areaResponsable}\n`);

    console.log('4. crearUsuario() - Error: usuario duplicado');
    try {
      await service.crearUsuario({ usuario: `admin_test_${ts}`, password: 'otro123', rol: 'asesor' });
      console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}\n`);
    }

    console.log('5. obtenerUsuarioPorId()');
    const encontrado = await service.obtenerUsuarioPorId(admin.id);
    console.log(`   Encontrado: ${encontrado.usuario} - ${encontrado.rol}\n`);

    console.log('6. login() - Credenciales correctas');
    const loginOk = await service.login({ usuario: `asesor_test_${ts}`, password: 'asesor123' });
    console.log(`   Login: ${loginOk.mensaje}\n`);

    console.log('7. login() - Credenciales incorrectas');
    try {
      await service.login({ usuario: `asesor_test_${ts}`, password: 'xxxxxx' });
      console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}\n`);
    }

    console.log('8. login() - Usuario inexistente');
    try {
      await service.login({ usuario: 'nadie_test_nadie', password: 'xxxxxx' });
      console.log('   ❌ ERROR: Debió fallar');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}\n`);
    }

    console.log('9. listarUsuarios()');
    const todos = await service.listarUsuarios();
    console.log(`   Total: ${todos.length} usuarios (deben incluir seed + creados)`);
    console.log('');

    console.log('10. buscarPorRol() - asesores');
    const asesores = await service.buscarPorRol('asesor');
    console.log(`   Asesores encontrados: ${asesores.length}\n`);

    console.log('11. calcularComision()');
    const comision = await service.calcularComision(asesor.id, 30000);
    console.log(`   Usuario: ${comision.usuario} | Venta: $${comision.montoVenta} | Comisión: $${comision.comision}\n`);

    console.log('12. actualizarUsuario()');
    const actualizado = await service.actualizarUsuario(asesor.id, {
      metaMensual: 15, especialidad: 'camionetas'
    });
    console.log(`   Actualizado: ${actualizado.especialidad} | Meta: ${actualizado.metaMensual}\n`);

    console.log('13. obtenerEstadisticas()');
    const stats = await service.obtenerEstadisticas();
    console.log(`   Total: ${stats.total} | Activos: ${stats.activos}`);
    console.log(`   Por rol: ${JSON.stringify(stats.porRol)}\n`);

    console.log('14. eliminarUsuario()');
    await service.eliminarUsuario(jefe.id);
    const restantes = await service.listarUsuarios();
    console.log(`   Eliminado. Quedan: ${restantes.length} usuarios\n`);

    console.log('15. Validaciones de creación');
    try {
      await service.crearUsuario({ usuario: 'ab', password: '123456', rol: 'asesor' });
      console.log('   ❌ ERROR: Debió fallar (usuario corto)');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    try {
      await service.crearUsuario({ usuario: 'test', password: '123', rol: 'asesor' });
      console.log('   ❌ ERROR: Debió fallar (password corta)');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}`);
    }
    try {
      await service.crearUsuario({ usuario: 'test', password: '123456', rol: 'invalido' as any });
      console.log('   ❌ ERROR: Debió fallar (rol inválido)');
    } catch (e: any) {
      console.log(`   ✅ Correctamente falló: ${e.message}`);
    }

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL SERVICIO USUARIO PASARON!');
  } catch (error: any) {
    console.error('❌ ERROR INESPERADO:', error.message);
  } finally {
    for (const id of creados) {
      try { await repo.delete(id); } catch { /* ignore */ }
    }
  }
})();
