import { Usuario } from './domain/entities/usuario.entity.js';

console.log('🧪 PROBANDO ENTIDAD USUARIO');
console.log('============================\n');

try {
    console.log('📌 Prueba 1: Crear administrador');
    const admin = Usuario.crear('admin', 'admin123', 'administrador', { nivelPermiso: 'total' });
    console.log(`✅ Creado: ${admin.toString()}`);
    console.log(`   Nivel permiso: ${admin.getNivelPermiso()}`);
    console.log(`   Es admin? ${admin.esAdministrador()}`);
    console.log('');

    console.log('📌 Prueba 2: Crear asesor');
    const asesor = Usuario.crear('carlos', 'asesor123', 'asesor', { especialidad: 'autos', experienciaAnios: 5, metaMensual: 10 });
    console.log(`✅ Creado: ${asesor.toString()}`);
    console.log(`   Especialidad: ${asesor.getEspecialidad()}`);
    console.log(`   Experiencia: ${asesor.getExperienciaAnios()} años`);
    console.log(`   Meta mensual: ${asesor.getMetaMensual()}`);
    console.log(`   Es asesor? ${asesor.esAsesor()}`);
    console.log('');

    console.log('📌 Prueba 3: Crear jefe de ventas');
    const jefe = Usuario.crear('jventas', 'jefe123', 'jefe_ventas', { areaResponsable: 'ventas', bonoGestion: 500 });
    console.log(`✅ Creado: ${jefe.toString()}`);
    console.log(`   Área: ${jefe.getAreaResponsable()}`);
    console.log(`   Bono: ${jefe.getBonoGestion()}`);
    console.log(`   Es jefe? ${jefe.esJefeVentas()}`);
    console.log('');

    console.log('📌 Prueba 4: Verificar password');
    console.log(`   Password correcto? ${asesor.verificarPassword('asesor123')}`);
    console.log(`   Password incorrecto? ${asesor.verificarPassword('xxxxxx')}`);
    console.log('');

    console.log('📌 Prueba 5: Cambiar password');
    asesor.cambiarPassword('nuevo456');
    console.log(`   Nuevo hash: ${asesor.getPasswordHash()}`);
    console.log('');

    console.log('📌 Prueba 6: Registrar acceso');
    asesor.registrarAcceso();
    console.log(`   Último acceso: ${asesor.getUltimoAcceso()}`);
    console.log('');

    console.log('📌 Prueba 7: Activar/Desactivar');
    asesor.desactivar();
    console.log(`   Desactivado, activo? ${asesor.isActivo()}`);
    asesor.activar();
    console.log(`   Reactivado, activo? ${asesor.isActivo()}`);
    console.log('');

    console.log('📌 Prueba 8: Calcular comisión (asesor con meta)');
    const comision = asesor.calcularComision(25000);
    console.log(`   Comisión sobre $25000: $${comision} (tasa 3%)`);
    console.log('');

    console.log('📌 Prueba 9: Calcular comisión (asesor sin meta)');
    const asesorSinMeta = Usuario.crear('pedro', 'asesor123', 'asesor', { especialidad: 'motos' });
    const comision2 = asesorSinMeta.calcularComision(25000);
    console.log(`   Comisión sobre $25000: $${comision2} (tasa 2%)`);
    console.log('');

    console.log('📌 Prueba 10: Jefe no puede calcular comisión');
    try {
        jefe.calcularComision(25000);
        console.log('❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 11: Validaciones inválidas');
    try {
        Usuario.crear('ab', '12', 'invalido' as any);
        console.log('❌ ERROR: Debió fallar');
    } catch (e: any) {
        console.log(`✅ Correctamente falló: ${e.message}`);
    }
    console.log('');

    console.log('📌 Prueba 12: toJSON');
    const json = admin.toJSON();
    console.log(`   JSON: ${JSON.stringify(json, null, 2)}`);

    const admin2 = Usuario.desdeDatos(json);
    console.log(`   Reconstruido: ${admin2.toString()}`);
    console.log('');

} catch (e: any) {
    console.error('❌ ERROR INESPERADO:', e.message);
}

console.log('🎉 PRUEBAS DE USUARIO COMPLETADAS');