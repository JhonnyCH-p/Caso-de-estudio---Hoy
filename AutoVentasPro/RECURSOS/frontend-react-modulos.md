# Migración Frontend React — Módulos Vehículo, Plan, Cotización, Venta

## Resumen

Creación de las interfaces React para los 4 módulos faltantes, siguiendo el mismo patrón del módulo Empleado existente. Se agregó navegación con `react-router-dom` y un Layout compartido.

## Cambios Realizados

### Dependencias
- Instalado `react-router-dom` para navegación SPA entre módulos

### Archivos Creados (16 nuevos)

```
frontend/src/
├── api/
│   ├── vehiculo.api.ts          # CRUD Vehículos + ajustarStock
│   ├── plan.api.ts              # CRUD Planes
│   ├── cotizacion.api.ts        # CRUD Cotizaciones + cambiarEstado
│   └── venta.api.ts             # CRUD Ventas + stats + porAsesor
├── types/
│   ├── vehiculo.types.ts        # Vehiculo, Crear/Actualizar Request, FormState
│   ├── plan.types.ts            # PlanFinanciamiento, Crear/Actualizar, FormState
│   ├── cotizacion.types.ts      # Cotizacion, FilaAmortizacion, Request/Estado
│   └── venta.types.ts           # Venta, Request/Estado, StatsResponse
├── hooks/
│   ├── useVehiculos.ts          # Hook CRUD + adjustStock
│   ├── usePlanes.ts             # Hook CRUD
│   ├── useCotizaciones.ts       # Hook CRUD + updateStatus
│   └── useVentas.ts             # Hook CRUD + updateStatus
├── components/
│   ├── Modal.tsx                # Modal reutilizable (genérico)
│   ├── VehiculoList.tsx         # Tabla vehículos + acciones
│   ├── VehiculoForm.tsx         # Formulario vehículo (marca, modelo, año, precio, tipo, stock, especs)
│   ├── PlanList.tsx             # Tabla planes + acciones
│   ├── PlanForm.tsx             # Formulario plan (nombre, entrada%, tasa%, plazos, comisión)
│   ├── CotizacionList.tsx       # Tabla cotizaciones + detalle + aprobar
│   ├── CotizacionForm.tsx       # Simulador completo (selecciona vehículo/plan/entrada/plazo/cliente)
│   ├── VentaList.tsx            # Tabla ventas + aprobar
│   ├── VentaForm.tsx            # Formulario venta (desde cotización aprobada + asesor)
│   └── Layout.tsx               # Navbar con tabs + <Outlet />
├── pages/
│   ├── EmployeesPage.tsx        # Estado y lógica de empleados (extraído de App.tsx)
│   ├── VehiculosPage.tsx        # Estado y lógica de vehículos
│   ├── PlanesPage.tsx           # Estado y lógica de planes
│   ├── CotizacionesPage.tsx     # Estado y lógica de cotizaciones
│   └── VentasPage.tsx           # Estado y lógica de ventas
├── App.tsx                      # Reescrito con BrowserRouter + Routes
└── index.css                    # #root simplificado para layout full-width
```

### Archivos Modificados (3)

- `frontend/src/App.tsx` — Reemplazado contenido por `<BrowserRouter><Routes>...</Routes></BrowserRouter>`
- `frontend/src/index.css` — `#root` simplificado para permitir layout full-width
- `frontend/package.json` — Agregada dependencia `react-router-dom`

## Patrón Seguido

Cada módulo replica exactamente el patrón del Employee existente:

```
types/*.types.ts      → Interfaces API + FormState + FormErrors
api/*.api.ts          → Métodos HTTP con axios (getAll, create, update, delete, etc.)
hooks/use*.ts         → Estado local (items[], loading, error) + operaciones CRUD
components/*List.tsx  → Tabla con estados: loading/error/empty/data
components/*Form.tsx  → Formulario controlado con validación inline
pages/*Page.tsx       → Orquestador: estado del modal, validación, submit
Modal.tsx             → Componente reutilizable (overlay + contenido)
Layout.tsx            → Navbar con NavLink + Outlet de react-router-dom
```

## Navegación

| Ruta | Módulo | Icono |
|------|--------|-------|
| `/` | Empleados | 👥 |
| `/vehiculos` | Vehículos | 🚗 |
| `/planes` | Planes Financieros | 📋 |
| `/cotizaciones` | Cotizaciones | 📊 |
| `/ventas` | Ventas | 💰 |

## Funcionalidades por Módulo

### 🚗 Vehículos
- CRUD completo (marca, modelo, año, precio, tipo, stock, especificaciones)
- Ajuste de stock (agregar/quitar unidades)
- Estados activo/inactivo

### 📋 Planes Financieros
- CRUD completo (nombre, entrada mínima %, tasa interés %, plazos disponibles, comisión)
- Plazos ingresados como texto separado por coma, convertidos a `number[]`
- Estados activo/inactivo

### 📊 Cotizaciones
- Crear cotización (simulador): selecciona vehículo → plan → entrada → plazo → cliente
- Muestra resultado en vivo: cuota mensual, tabla amortización, totales
- Ver detalle completo de cualquier cotización
- Aprobar cotización (para permitir crear venta)
- Cambiar estado (APROBADA/RECHAZADA/EXPIRADA)

### 💰 Ventas
- Crear venta desde cotización aprobada (carga automática valor total)
- Selección de asesor (empleados activos)
- Aprobar/rechazar ventas
- Listado con estados

## Build

```bash
npm run build
# ✓ built in ~500ms
# dist/assets/index-xxx.js   339.35 kB (gzip: 100.22 kB)
# dist/assets/index-xxx.css   20.36 kB (gzip: 4.99 kB)
```

## Desarrollo

Dos terminales:
```bash
# Terminal 1: Backend
cd AutoVentasPro
npm run dev          # → http://localhost:3000

# Terminal 2: Frontend
cd AutoVentasPro/frontend
npm run dev          # → http://localhost:5173
```

El proxy de Vite redirige `/api/*` → `http://localhost:3000`.
