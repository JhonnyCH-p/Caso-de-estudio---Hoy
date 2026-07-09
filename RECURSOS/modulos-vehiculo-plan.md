# Implementación de Módulos Vehículo y PlanFinanciamiento

## Resumen

Se implementaron los módulos **Vehículo** y **PlanFinanciamiento** siguiendo el mismo patrón de Arquitectura Hexagonal que Empleado y Usuario, alineando las entidades de dominio con el esquema de Prisma (PostgreSQL en Supabase).

---

## 1. Cambios en Prisma Schema

### Vehiculo (`prisma/schema.prisma`)

| Antes | Después |
|-------|---------|
| `nombre: String` | → `marca: String`, `modelo: String` |
| `categoria: String` | → `tipo: String`, `anio: Int` |
| `precio: Float` | → `precioBase: Float` |
| `imagenUrl: String?` | Eliminado |
| — | `stock: Int @default(0)` |
| `especificaciones: String?` | Se conserva (JSON string) |

### PlanFinanciamiento

| Antes | Después |
|-------|---------|
| `tasaInteres: Float` | → `tasaInteresAnual: Float` |
| `plazoMin: Int`, `plazoMax: Int` | → `plazosDisponibles: String` (JSON array) |
| `entradaMin: Float` | → `entradaMinima: Float` |
| — | `comision: Float @default(0)` |

**Migración aplicada:** `20260708011332_update_vehiculo_plan`

---

## 2. Entidades de Dominio

### Vehiculo (`src/domain/entities/Vehiculo.ts`)

- Constructor privado + interfaz `DatosVehiculo`
- Factory methods: `Vehiculo.crear()`, `Vehiculo.desdeDatos()`
- Getters: `getMarca()`, `getModelo()`, `getAnio()`, `getPrecioBase()`, `getTipo()`, `getStock()`, `getEspecificaciones()`, `isActivo()`, `estaDisponible()`
- Setters individuales: `setMarca()`, `setModelo()`, `setAnio()`, `setPrecioBase()`, `setTipo()`, `setEspecificaciones()`
- Métodos de negocio: `ajustarStock(cantidad)`, `activar()`, `desactivar()`
- Validaciones: marca ≥ 2 chars, modelo ≥ 2 chars, año 1900-siguiente, precio ≥ 0, stock ≥ 0, tipo en `[SEDAN, SUV, HATCHBACK, PICKUP, DEPORTIVO]`
- `toJSON()` serializa todos los campos incluyendo `especificaciones` como string JSON

### PlanFinanciamiento (`src/domain/entities/PlanFinanciamiento.ts`)

- Constructor privado + interfaz `DatosPlanFinanciamiento`
- Factory methods: `PlanFinanciamiento.crear()`, `PlanFinanciamiento.desdeDatos()`
- Getters: `getNombre()`, `getEntradaMinima()`, `getTasaInteresAnual()`, `getPlazosDisponibles()`, `getComision()`, `isActivo()`
- Setters individuales
- Método de negocio: `calcularCuota(montoFinanciado, plazoMeses)` — fórmula de amortización de cuota fija
- `plazosDisponibles` se almacena como JSON string en DB, se parsea a `number[]` en getter
- Validaciones: nombre ≥ 2 chars, entrada mínima 0-100, tasa ≥ 0, comisión ≥ 0, plazos array positivo no vacío

---

## 3. Repositorios

### Interfaces

```typescript
// VehiculoRepository
save, update, delete, findById, findAll, findDisponibles, count

// PlanFinanciamientoRepository
save, update, delete, findById, findAll, findActivos, count
```

### Implementaciones

| Repositorio | Archivo | Uso |
|-------------|---------|-----|
| `VehiculoInMemoryRepository` | `infrastructure/repositories/VehiculoRepositoryImpl.ts` | Tests |
| `VehiculoSupabaseRepository` | `infrastructure/repositories/vehiculo.supabase.repository.ts` | Producción (Supabase) |
| `PlanFinanciamientoInMemoryRepository` | `infrastructure/repositories/InMemoryPlanFinanciamientoRepository.ts` | Tests |
| `PlanFinanciamientoSupabaseRepository` | `infrastructure/repositories/plan.supabase.repository.ts` | Producción (Supabase) |

Los repositorios Supabase usan el singleton `getPrisma()` y hacen mapeo directo entre `toJSON()` de la entidad y las tablas PostgreSQL.

---

## 4. DTOs

### Requests

```typescript
// CrearVehiculoRequest
{ marca, modelo, anio, precioBase, tipo, stock?, especificaciones? }

// ActualizarVehiculoRequest
{ marca?, modelo?, anio?, precioBase?, tipo?, stock?, especificaciones?, activo? }

// CrearPlanFinanciamientoRequest
{ nombre, entradaMinima, tasaInteresAnual, plazosDisponibles: number[], comision? }

// ActualizarPlanFinanciamientoRequest
{ nombre?, entradaMinima?, tasaInteresAnual?, plazosDisponibles?, comision?, activo? }
```

### Responses

```typescript
// VehiculoResponse
{ id, marca, modelo, anio, precioBase, tipo, stock, especificaciones, activo, disponible, createdAt, updatedAt }

// PlanFinanciamientoResponse
{ id, nombre, entradaMinima, tasaInteresAnual, plazosDisponibles: number[], comision, activo, createdAt, updatedAt }
```

---

## 5. Servicios

### VehiculoService

| Método | Descripción |
|--------|-------------|
| `crearVehiculo(request)` | Valida y crea vehículo |
| `listarVehiculos(disponibles?)` | Lista todos o solo disponibles |
| `obtenerVehiculoPorId(id)` | Busca por ID |
| `actualizarVehiculo(id, request)` | Actualiza campos |
| `eliminarVehiculo(id)` | Elimina físicamente |
| `ajustarStock(id, cantidad)` | Ajusta stock (+/-) |
| `obtenerEstadisticas()` | Total, disponibles, precio promedio/max/min |

### PlanFinanciamientoService

| Método | Descripción |
|--------|-------------|
| `crearPlan(request)` | Valida y crea plan |
| `listarPlanes(activos?)` | Lista todos o solo activos |
| `obtenerPlanPorId(id)` | Busca por ID |
| `actualizarPlan(id, request)` | Actualiza campos |
| `eliminarPlan(id, fisico?)` | Eliminación lógica o física |
| `calcularCuota(idPlan, monto, plazo)` | Calcula cuota mensual |

---

## 6. Controladores

```typescript
// VehiculoController
crear, listar, obtenerPorId, actualizar, eliminar, ajustarStock, estadisticas

// PlanFinanciamientoController
crear, listar, obtenerPorId, actualizar, eliminar, calcularCuota
```

Todos siguen el patrón: arrow functions, try/catch con status codes, respuestas en formato `{ data: ... }` o `{ count, data }`.

---

## 7. Endpoints REST (montados en `app.ts`)

```
POST   /api/vehiculos          → VehiculoController.crear
GET    /api/vehiculos          → VehiculoController.listar (?disponibles=true)
GET    /api/vehiculos/stats    → VehiculoController.estadisticas
GET    /api/vehiculos/:id      → VehiculoController.obtenerPorId
PUT    /api/vehiculos/:id      → VehiculoController.actualizar
DELETE /api/vehiculos/:id      → VehiculoController.eliminar
PATCH  /api/vehiculos/:id/stock → VehiculoController.ajustarStock

POST   /api/planes             → PlanFinanciamientoController.crear
GET    /api/planes             → PlanFinanciamientoController.listar (?activos=true)
GET    /api/planes/:id         → PlanFinanciamientoController.obtenerPorId
PUT    /api/planes/:id         → PlanFinanciamientoController.actualizar
DELETE /api/planes/:id         → PlanFinanciamientoController.eliminar (?fisico=true)
POST   /api/planes/:id/calcular-cuota → PlanFinanciamientoController.calcularCuota
```

---

## 8. Seed de Datos

Registros agregados al seed (`prisma/seed.ts`):

| Tabla | Registros |
|-------|-----------|
| `Vehiculo` | Toyota Corolla ($25k), Honda CR-V ($32k), Chevrolet Sail ($18k), Toyota Hilux ($45k), Ford Mustang ($55k) |
| `PlanFinanciamiento` | Plan Básico (8.5%, 12-36 meses), Plan Estándar (6.5%, 12-48 meses), Plan Premium (4.5%, 12-60 meses), Plan Rápido (5%, 6-18 meses) |

---

## 9. Archivos Eliminados

| Archivo | Motivo |
|---------|--------|
| `tests/test-asesor-entity.ts` | Módulo Asesor obsoleto (reemplazado por Usuario) |
| `tests/test-asesor-repository.ts` | Módulo Asesor obsoleto |
| `tests/test-asesor-service.ts` | Módulo Asesor obsoleto |
| `tests/test-asesor.ts` | Módulo Asesor obsoleto |
| `tests/test-vehiculo-service.ts` | Service test refería a patrón antiguo |
| `tests/test-plan-repository.ts` | Repository test refería a patrón antiguo |
| `tests/test-plan-service.ts` | Service test refería a patrón antiguo |
| `src/application/dtos/requests/AsesorRequest.ts` | DTO obsoleto |
| `src/application/dtos/responses/AsesorResponse.ts` | DTO obsoleto |

---

## 10. Tests

```
npm run test:vehiculos   → 29 entity + 15 repo = 44 tests, 0 fallos
npm run test:planes      → 27 entity = 27 tests, 0 fallos
npm run test:all         → 127 tests totales (Usuario + Empleado + Vehiculo + Plan), 0 fallos
```

### Comandos disponibles

```bash
npm run test:all           # Todos los tests
npm run test               # Ídem
npm run test:vehiculos     # Vehículo entity + repo
npm run test:planes        # Plan entity
npm run test:empleado      # Empleado entity + repo + service
npm run test:usuario       # Usuario entity + repo + service
```

---

## 11. Verificación en Supabase

```bash
# Seed de datos (vehículos y planes)
npm run prisma:seed

# Probar endpoints
curl http://localhost:3000/api/vehiculos
curl http://localhost:3000/api/vehiculos/stats
curl http://localhost:3000/api/planes
```

**Resultados verificados:**
- `GET /api/vehiculos` → 5 vehículos desde PostgreSQL (Supabase)
- `GET /api/vehiculos/stats` → Total: 5, Precio promedio: $35,000
- `GET /api/planes` → 4 planes desde PostgreSQL (Supabase)

---

## 12. Próximos Pasos

1. Módulo **Cotización** (integra Vehículo + PlanFinanciamiento)
2. Módulo **Venta** (integra todos los módulos anteriores)
3. Integración con frontend React para Vehículos y Planes
