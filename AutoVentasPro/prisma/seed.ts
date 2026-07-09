import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { Empleado } from '../src/domain/entities/empleado.entity.js';
import { Usuario } from '../src/domain/entities/usuario.entity.js';
import { Vehiculo } from '../src/domain/entities/Vehiculo.js';
import { PlanFinanciamiento } from '../src/domain/entities/PlanFinanciamiento.js';
import { Cotizacion } from '../src/domain/entities/Cotizacion.js';
import { Venta } from '../src/domain/entities/Venta.js';
import { ClienteInfo } from '../src/domain/value-objects/ClienteInfo.js';
import { TablaAmortizacion } from '../src/domain/value-objects/TablaAmortizacion.js';

async function seed() {
    const pool = new pg.Pool({
        host: process.env['DB_HOST'],
        port: Number(process.env['DB_PORT']),
        database: process.env['DB_NAME'],
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🌱 Sembrando base de datos...\n');

    const empleadosCount = await prisma.empleado.count();
    if (empleadosCount === 0) {
        const empleados = [
            Empleado.crear('1234567890', 'Ana García', 2500, 'Ventas'),
            Empleado.crear('0987654321', 'Carlos López', 3200, 'Tecnología'),
            Empleado.crear('1122334455', 'María Pérez', 1800, 'Marketing'),
            Empleado.crear('5566778899', 'Pedro Ramírez', 4000, 'Finanzas'),
            Empleado.crear('9988776655', 'Laura Jiménez', 2800, 'Ventas'),
        ];
        for (const e of empleados) {
            await prisma.empleado.create({ data: e.toJSON() });
            console.log(`   ✅ Empleado: ${e.getNombres()}`);
        }
    } else {
        console.log(`   ⏭️  Ya hay ${empleadosCount} empleados`);
    }

    const usuariosCount = await prisma.usuario.count();
    if (usuariosCount === 0) {
        const passwords = ['admin123', 'jefe123', 'asesor123', 'asesor123'];
        const usuarios = [
            ['admin', passwords[0], 'administrador', { nivelPermiso: 'total' }] as const,
            ['jventas', passwords[1], 'jefe_ventas', { areaResponsable: 'ventas', bonoGestion: 500 }] as const,
            ['carlos', passwords[2], 'asesor', { especialidad: 'autos', experienciaAnios: 5, metaMensual: 10 }] as const,
            ['maria', passwords[3], 'asesor', { especialidad: 'camionetas', experienciaAnios: 3, metaMensual: 8 }] as const,
        ];
        for (const [username, rawPw, rol, extras] of usuarios) {
            const hash = bcrypt.hashSync(rawPw, 10);
            const u = Usuario.crear(username, hash, rol, extras as any);
            await prisma.usuario.create({ data: u.toJSON() as any });
            console.log(`   ✅ Usuario: ${u.getUsuario()} (${u.getRol()})`);
        }
    } else {
        console.log(`   ⏭️  Ya hay ${usuariosCount} usuarios`);
    }

    const vehiculosCount = await prisma.vehiculo.count();
    if (vehiculosCount === 0) {
        const vehiculos = [
            Vehiculo.crear('Toyota', 'Corolla', 2024, 25000, 'SEDAN', 5),
            Vehiculo.crear('Honda', 'CR-V', 2024, 32000, 'SUV', 3),
            Vehiculo.crear('Chevrolet', 'Sail', 2024, 18000, 'HATCHBACK', 8),
            Vehiculo.crear('Toyota', 'Hilux', 2024, 45000, 'PICKUP', 2),
            Vehiculo.crear('Ford', 'Mustang', 2024, 55000, 'DEPORTIVO', 1),
            Vehiculo.crear('Nissan', 'Leaf', 2024, 38000, 'SEDAN', 4),
            Vehiculo.crear('Hyundai', 'Elantra', 2024, 22000, 'SEDAN', 6),
            Vehiculo.crear('Kia', 'Sportage', 2024, 29000, 'SUV', 3),
        ];
        for (const v of vehiculos) {
            await prisma.vehiculo.create({ data: v.toJSON() as any });
            console.log(`   ✅ Vehículo: ${v.getMarca()} ${v.getModelo()}`);
        }
    } else {
        console.log(`   ⏭️  Ya hay ${vehiculosCount} vehículos`);
    }

    const planesCount = await prisma.planFinanciamiento.count();
    if (planesCount === 0) {
        const planes = [
            PlanFinanciamiento.crear('Plan Básico', 20, 8.5, [12, 24, 36], 0),
            PlanFinanciamiento.crear('Plan Estándar', 15, 6.5, [12, 24, 36, 48], 1),
            PlanFinanciamiento.crear('Plan Premium', 10, 4.5, [12, 24, 36, 48, 60], 2),
            PlanFinanciamiento.crear('Plan Rápido', 30, 5.0, [6, 12, 18], 0.5),
        ];
        for (const p of planes) {
            await prisma.planFinanciamiento.create({ data: p.toJSON() as any });
            console.log(`   ✅ Plan: ${p.getNombre()}`);
        }
    } else {
        console.log(`   ⏭️  Ya hay ${planesCount} planes`);
    }

    const cotizacionesCount = await prisma.cotizacion.count();
    if (cotizacionesCount === 0) {
        const cliente = new ClienteInfo({ nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '0999999999', cedula: '1234567890', ciudad: 'Quito' });
        const tabla = TablaAmortizacion.generar(20000, 8.5, 24, 908.97);
        const cotizacion = Cotizacion.crear(
            (await prisma.vehiculo.findFirst())!.id,
            (await prisma.planFinanciamiento.findFirst())!.id,
            cliente, 25000, 5000, 24, 8.5, 908.97, tabla,
        );
        await prisma.cotizacion.create({ data: cotizacion.toJSON() as any });
        console.log(`   ✅ Cotización: ${cotizacion.getId()}`);
    } else {
        console.log(`   ⏭️  Ya hay ${cotizacionesCount} cotizaciones`);
    }

    const ventasCount = await prisma.venta.count();
    if (ventasCount === 0) {
        const primeraCotizacion = await prisma.cotizacion.findFirst();
        const asesor = await prisma.usuario.findFirst({ where: { rol: 'asesor' } });
        if (primeraCotizacion && asesor) {
            const venta = Venta.crear(primeraCotizacion.id, asesor.id, 25000);
            await prisma.venta.create({ data: venta.toJSON() as any });
            console.log(`   ✅ Venta: ${venta.getId()} (asesor: ${asesor.usuario})`);
        }
    } else {
        console.log(`   ⏭️  Ya hay ${ventasCount} ventas`);
    }

    console.log('\n🌱 Seed completado!');
    await prisma.$disconnect();
}

seed().catch(e => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
});
