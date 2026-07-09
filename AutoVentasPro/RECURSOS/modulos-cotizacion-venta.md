# Módulos Cotización y Venta

## Resumen

Implementación completa de los módulos **Cotización** y **Venta** siguiendo la arquitectura hexagonal (Dominio → Aplicación → Interfaces → Infraestructura), con sus respectivos value objects, DTOs, repositorios duales (InMemory/Supabase), servicios, controladores y rutas.

## Estructura de Archivos

```
src/
├── domain/
│   ├── value-objects/
│   │   ├── ClienteInfo.ts              # VO cliente (nombre, email, teléfono)
│   │   └── TablaAmortizacion.ts        # VO tabla amortización francesa
│   └── entities/
│       ├── Cotizacion.ts               # Entidad cotización
│       └── Venta.ts                    # Entidad venta
├── application/
│   ├── dtos/
│   │   ├── requests/
│   │   │   ├── CotizacionRequest.ts    # Crear/CambiarEstado cotización
│   │   │   └── VentaRequest.ts         # Crear/CambiarEstado venta
│   │   └── responses/
│   │       ├── CotizacionResponse.ts   # Response con tabla amortización
│   │       └── VentaResponse.ts        # Response venta
│   └── services/
│       ├── CotizacionService.ts        # Lógica de cotización + validaciones
│       └── VentaService.ts             # Lógica de venta + stats
├── interfaces/
│   ├── controllers/
│   │   ├── CotizacionController.ts     # Handlers HTTP cotización
│   │   └── VentaController.ts          # Handlers HTTP venta
│   └── routes/
│       ├── cotizacionRoutes.ts         # Rutas /api/cotizaciones/*
│       └── ventaRoutes.ts              # Rutas /api/ventas/*
├── infrastructure/
│   └── repositories/
│       ├── interfaces/
│       │   ├── ICotizacionRepository.ts
│       │   └── IVentaRepository.ts
│       ├── in-memory/
│       │   ├── InMemoryCotizacionRepository.ts
│       │   └── InMemoryVentaRepository.ts
│       └── supabase/
│           ├── SupabaseCotizacionRepository.ts
│           └── SupabaseVentaRepository.ts
tests/
├── test-cotizacion-entity.ts           # 21 tests entity
├── test-venta-entity.ts                # 16 tests entity
└── test-cotizacion-repository.ts       # Tests repository
```

## Value Objects

### ClienteInfo (`src/domain/value-objects/ClienteInfo.ts`)

- Campos privados: `nombre`, `email`, `telefono`
- Factory method `crear()` con validaciones
- Getters públicos
- `toJSON()` para serialización

### TablaAmortizacion (`src/domain/value-objects/TablaAmortizacion.ts`)

- Genera tabla de amortización usando **Sistema Francés** (cuota fija)
- Fórmula: `cuota = P * (r * (1 + r)^n) / ((1 + r)^n - 1)`
- Cada fila contiene: cuota #, capital, interés, saldo restante
- Calcula total intereses y total pagado

## Entidades

### Cotizacion (`src/domain/entities/Cotizacion.ts`)
- Estados: `PENDIENTE`, `APROBADA`, `RECHAZADA`, `EXPIRADA`
- Contiene vehículo, plan, cliente, entrada, monto, plazo, cuota, tabla amortización
- Inyecta repositorios de vehículo y plan para validaciones
- Validaciones: vehículo activo + disponible, plan activo, entrada ≥ mínima, plazo disponible
- `toJSON()` serializa ClienteInfo y TablaAmortizacion como objetos planos

### Venta (`src/domain/entities/Venta.ts`)
- Estados: `PENDIENTE`, `APROBADA`, `RECHAZADA`, `CANCELADA`
- Solo se crea desde cotización aprobada (validación en Service)
- `toJSON()` serializa fechas como strings ISO

## API Endpoints

### Cotizaciones (`/api/cotizaciones`)
```
POST   /api/cotizaciones              → Crear cotización (simular)
GET    /api/cotizaciones              → Listar (?activas=true)
GET    /api/cotizaciones/:id          → Obtener por ID
PATCH  /api/cotizaciones/:id/estado   → Cambiar estado
DELETE /api/cotizaciones/:id          → Eliminar
```

### Ventas (`/api/ventas`)
```
POST   /api/ventas                    → Crear venta (requiere cotización aprobada)
GET    /api/ventas                    → Listar (?estado=)
GET    /api/ventas/stats              → Estadísticas
GET    /api/ventas/asesor/:id         → Ventas por asesor
GET    /api/ventas/:id                → Obtener por ID
PATCH  /api/ventas/:id/estado         → Cambiar estado
DELETE /api/ventas/:id                → Eliminar
```

## Tests

- **21 tests** de entidad Cotización: creación, getters, estados, validaciones
- **16 tests** de entidad Venta: creación, estados, cambios de estado
- **Tests de repositorio**: InMemory CRUD para ambos módulos
- Total: **164 tests, 0 fallos** (incluyendo tests previos de empleado, usuario, vehículo, plan)

## Prisma Schema

Modelos agregados en `prisma/schema.prisma`:

```prisma
model Cotizacion {
  id               String   @id
  vehiculoId       String
  planId           String
  // Cliente: nombre, email, telefono
  // Financiero: entrada, monto, plazo, tasa, cuota
  // Tabla: JSON string de amortización
  // Totales: intereses, pagado
  estado           String   @default("PENDIENTE")
  // timestamps
}

model Venta {
  id          String   @id
  cotizacionId String
  asesorId    String
  valorTotal  Float
  estado      String   @default("PENDIENTE")
  // timestamps
}
```

## Seed Data

Ejecutado con: 1 cotización + 1 venta de prueba pobladas en Supabase.
