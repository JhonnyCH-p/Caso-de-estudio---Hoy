import { getPrisma } from '../../infrastructure/database/prisma.service.js';

export class DashboardService {
    async getDashboard() {
        const prisma = getPrisma();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalVehiculos, ventasMes, ingresosMes, cotizacionesActivas] = await Promise.all([
            prisma.vehiculo.count({ where: { activo: true } }),
            prisma.venta.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.venta.aggregate({
                _sum: { valorTotal: true },
                where: { createdAt: { gte: startOfMonth } },
            }),
            prisma.cotizacion.count({ where: { estado: { in: ['PENDIENTE', 'APROBADA'] } } }),
        ]);

        const ventasPorAsesorRaw = await prisma.venta.groupBy({
            by: ['asesorId'],
            _count: { id: true },
            _sum: { valorTotal: true },
        });

        const asesorIds = ventasPorAsesorRaw.map(v => v.asesorId);
        const usuarios = asesorIds.length > 0
            ? await prisma.usuario.findMany({ where: { id: { in: asesorIds } }, select: { id: true, usuario: true } })
            : [];
        const usuarioMap = new Map(usuarios.map(u => [u.id, u.usuario]));

        const ventasPorAsesor = ventasPorAsesorRaw.map(v => ({
            asesorId: v.asesorId,
            asesorNombre: usuarioMap.get(v.asesorId) || 'Desconocido',
            totalVentas: v._count.id,
            montoTotal: v._sum.valorTotal || 0,
        }));

        const doceMesesAtras = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const ventasMensualesRaw = await prisma.venta.findMany({
            where: { createdAt: { gte: doceMesesAtras } },
            select: { createdAt: true, valorTotal: true },
        });

        const tendenciaMensualMap = new Map<string, { ventas: number; ingresos: number }>();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            tendenciaMensualMap.set(key, { ventas: 0, ingresos: 0 });
        }
        for (const v of ventasMensualesRaw) {
            const key = `${v.createdAt.getFullYear()}-${String(v.createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (tendenciaMensualMap.has(key)) {
                const entry = tendenciaMensualMap.get(key)!;
                entry.ventas++;
                entry.ingresos += v.valorTotal;
            }
        }
        const tendenciaMensual = Array.from(tendenciaMensualMap.entries()).map(([mes, datos]) => ({
            mes,
            ...datos,
        }));

        const cotizacionesConVentas = await prisma.venta.findMany({
            select: { cotizacionId: true },
        });
        const cotizacionIds = cotizacionesConVentas.map(v => v.cotizacionId);

        const vehiculosVendidos = await prisma.cotizacion.findMany({
            where: { id: { in: cotizacionIds } },
            select: { vehiculoId: true },
        });

        const vehiculoCountMap = new Map<string, number>();
        for (const cv of vehiculosVendidos) {
            vehiculoCountMap.set(cv.vehiculoId, (vehiculoCountMap.get(cv.vehiculoId) || 0) + 1);
        }

        const topVehiculoIds = Array.from(vehiculoCountMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id]) => id);

        const topVehiculos = topVehiculoIds.length > 0
            ? await prisma.vehiculo.findMany({
                where: { id: { in: topVehiculoIds } },
                select: { id: true, marca: true, modelo: true, anio: true, precioBase: true },
            })
            : [];

        const top = topVehiculos.map(v => ({
            vehiculoId: v.id,
            nombre: `${v.marca} ${v.modelo} ${v.anio}`,
            precioBase: v.precioBase,
            totalVentas: vehiculoCountMap.get(v.id) || 0,
        }));

        return {
            kpis: {
                totalVehiculos,
                ventasMes,
                ingresosMes: ingresosMes._sum.valorTotal || 0,
                cotizacionesActivas,
            },
            ventasPorAsesor,
            tendenciaMensual,
            topVehiculos: top,
        };
    }
}
