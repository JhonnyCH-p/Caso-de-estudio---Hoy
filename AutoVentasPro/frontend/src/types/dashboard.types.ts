export interface DashboardKPIs {
   totalVehiculos: number;
   ventasMes: number;
   ingresosMes: number;
   cotizacionesActivas: number;
}

export interface VentaPorAsesor {
   asesorId: string;
   asesorNombre: string;
   totalVentas: number;
   montoTotal: number;
}

export interface TendenciaMensual {
   mes: string;
   ventas: number;
   ingresos: number;
}

export interface TopVehiculo {
   vehiculoId: string;
   nombre: string;
   precioBase: number;
   totalVentas: number;
}

export interface DashboardData {
   kpis: DashboardKPIs;
   ventasPorAsesor: VentaPorAsesor[];
   tendenciaMensual: TendenciaMensual[];
   topVehiculos: TopVehiculo[];
}
