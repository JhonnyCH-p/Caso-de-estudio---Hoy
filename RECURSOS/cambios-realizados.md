# Cambios Realizados - AutoVentas Pro

## Resumen General

Implementación del módulo **Empleado** en el backend (Arquitectura Hexagonal) alineado con el frontend React existente (`concesionaria-fe`). Configuración del servidor Express con CORS, 7 endpoints REST, y persistencia con **Prisma ORM 7 + PostgreSQL (Supabase)** usando `@prisma/adapter-pg` + `pg.Pool`.

> **Nota:** La base de datos usa **PostgreSQL** (no SQLite) para ser compatible con Supabase. El adapter `@prisma/adapter-pg` con `pg.Pool` sigue el mismo patrón que el proyecto `proyecto_bienesyraices1`.

---

## Nuevos Archivos (11)

### 1. `src/domain/entities/empleado.entity.ts`
- Entidad `Empleado` con constructor privado + factory methods (`crear`, `desdeDatos`)
- Campos: `id`, `cedula`, `nombres`, `salario`, `departamento`, `activo`, `createdAt`, `updatedAt`
- Métodos de dominio: `setNombres()`, `setSalario()`, `setDepartamento()`, `activar()/desactivar()`, `aumentarSalario(porcentaje)`, `toJSON()`

### 2. `src/domain/repositories/empleado.repository.ts`
- Interfaz: `save`, `update`, `delete`, `findById`, `findAll`, `count`

### 3. `src/infrastructure/repositories/empleado.inmemory.repository.ts`
- Implementación InMemory con `Map<string, DatosEmpleado>`
- Método `seed()` con 5 empleados de prueba:
  - Ana García (Ventas, $2500)
  - Carlos López (Tecnología, $3200)
  - María Pérez (Marketing, $1800)
  - Pedro Ramírez (Finanzas, $4000)
  - Laura Jiménez (Ventas, $2800)

### 4. `src/application/dtos/requests/EmpleadoRequest.ts`
- `CrearEmpleadoRequest`: `cedula`, `nombres`, `salario`, `departamento?`
- `ActualizarEmpleadoRequest`: `nombres?`, `salario?`, `departamento?`, `activo?`
- `AumentoSalarioRequest`: `percentage`

### 5. `src/application/dtos/responses/EmpleadoResponse.ts`
- `EmpleadoResponse`: todos los campos del empleado
- `EmpleadoListResponse`: `{ count, data: EmpleadoResponse[] }`
- `EmpleadoStatsResponse`: `{ total, averageSalary, maxSalary, minSalary }`

### 6. `src/application/services/EmpleadoService.ts`
- `crearEmpleado()` — validación + creación
- `listarEmpleados(activos?)` — todos o solo activos
- `obtenerEmpleadoPorId()` — por ID
- `actualizarEmpleado()` — usando `toJSON()` + `desdeDatos()`
- `eliminarEmpleado()` — delete lógico
- `aumentarSalario()` — aumenta por porcentaje (1-100)
- `obtenerEstadisticas()` — total, promedio, max, min

### 7. `src/interfaces/controllers/EmpleadoController.ts`
| Método | Ruta | Handler | Response éxito |
|--------|------|---------|---------------|
| POST   | `/api/employees` | `crear` | `201 { data: Empleado }` |
| GET    | `/api/employees` | `listar` | `200 { count, data: [] }` |
| GET    | `/api/employees/stats` | `estadisticas` | `200 { data: Stats }` |
| GET    | `/api/employees/:id` | `obtenerPorId` | `200 { data: Empleado }` |
| PUT    | `/api/employees/:id` | `actualizar` | `200 { data: Empleado }` |
| DELETE | `/api/employees/:id` | `eliminar` | `200 { data: { message } }` |
| PATCH  | `/api/employees/:id/salary` | `aumentarSalario` | `200 { data: Empleado }` |

### 8. `src/interfaces/routes/empleadoRoutes.ts`
- Auto-wiring de dependencias
- 7 rutas montadas en orden correcto (`/stats` antes de `/:id`)

### 9-11. Tests
| Archivo | Pruebas | Estado |
|---------|---------|--------|
| `tests/test-empleado-entity.ts` | 12 | ✅ Pasan |
| `tests/test-empleado-repository.ts` | 10 | ✅ Pasan |
| `tests/test-empleado-service.ts` | 15 | ✅ Pasan |

---

## Archivos Modificados (3)

### `src/app.ts`
```typescript
import express from 'express';
import cors from 'cors';
import { EmpleadoRoutes } from './interfaces/routes/empleadoRoutes.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/employees', EmpleadoRoutes);
export { app };
```

### `src/server.ts`
```typescript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { /* log endpoints */ });
```

### `package.json`
- **Dependencia agregada**: `cors: ^2.8.5`
- **Nuevos scripts**:
  - `test:entity-empleado` — entity test
  - `test:repository-empleado` — repository test
  - `test:service-empleado` — service test
  - `test:empleado` — ejecuta los 3 en serie
- **Script actualizado**: `dev` → `tsx watch src/server.ts`
- **Script actualizado**: `test` → `npm run test:empleado`
- **Script actualizado**: `test:all` — incluye tests de empleado

---

## Endpoints de la API

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| `POST` | `/api/employees` | `{ cedula, nombres, salario, departamento? }` | `201 { data: Empleado }` |
| `GET` | `/api/employees` | `?activos=true` | `200 { count, data: [] }` |
| `GET` | `/api/employees/stats` | — | `200 { data: { total, averageSalary, maxSalary, minSalary } }` |
| `GET` | `/api/employees/:id` | — | `200 { data: Empleado }` |
| `PUT` | `/api/employees/:id` | `{ nombres?, salario?, departamento?, activo? }` | `200 { data: Empleado }` |
| `DELETE` | `/api/employees/:id` | — | `200 { data: { message } }` |
| `PATCH` | `/api/employees/:id/salary` | `{ percentage }` | `200 { data: Empleado }` |

---

## Alineación con Frontend (`concesionaria-fe`)

### Coincidencia de endpoints
| Frontend `employee.api.ts` | Backend | Estado |
|---------------------------|---------|--------|
| `EmployeeAPI.getAll()` → `GET /api/employees` | `EmpleadoController.listar` | ✅ |
| `EmployeeAPI.getById(id)` → `GET /api/employees/:id` | `EmpleadoController.obtenerPorId` | ✅ |
| `EmployeeAPI.create(data)` → `POST /api/employees` | `EmpleadoController.crear` | ✅ |
| `EmployeeAPI.update(id, data)` → `PUT /api/employees/:id` | `EmpleadoController.actualizar` | ✅ |
| `EmployeeAPI.delete(id)` → `DELETE /api/employees/:id` | `EmpleadoController.eliminar` | ✅ |
| `EmployeeAPI.getStats()` → `GET /api/employees/stats` | `EmpleadoController.estadisticas` | ✅ |
| `EmployeeAPI.increaseSalary(id, pct)` → `PATCH /api/employees/:id/salary` | `EmpleadoController.aumentarSalario` | ✅ |

### Coincidencia de tipos
| Frontend `employee.types.ts` | Backend | Estado |
|------------------------------|---------|--------|
| `Employee { id, cedula, nombres, salario, departamento, activo, createdAt, updatedAt }` | `EmpleadoResponse` | ✅ |
| `CreateEmployeeRequest { cedula, nombres, salario, departamento? }` | `CrearEmpleadoRequest` | ✅ |
| `UpdateEmployeeRequest { nombres?, salario?, departamento?, activo? }` | `ActualizarEmpleadoRequest` | ✅ |
| `EmployeeListResponse { count, data: [] }` | `EmpleadoListResponse` | ✅ |
| `EmployeeStatsResponse { total, averageSalary, maxSalary, minSalary }` | `EmpleadoStatsResponse` | ✅ |

### Coincidencia de response format
| Frontend espera | Backend devuelve |
|----------------|------------------|
| `response.data.data` (para entidad individual) | `{ data: Empleado }` |
| `response.data.data` (para listado) | `{ count, data: [] }` |
| `response.data.data` (para stats) | `{ data: Stats }` |

---

## Segunda Fase: Prisma ORM + PostgreSQL (Supabase)

### ¿Qué cambió?
Se reemplazó el almacenamiento en memoria (`InMemoryRepository`) por una base de datos **PostgreSQL** gestionada con **Prisma ORM 7**. Conectado a **Supabase** usando `@prisma/adapter-pg` + `pg.Pool`. Las interfaces de repositorio existentes **no cambiaron**; solo se agregaron nuevas implementaciones.

### Arquitectura de persistencia

```
domain/repositories/         ← INTERFAZ (sin cambios)
  empleado.repository.ts     → save(), update(), delete(), findById(), findAll(), count()
  usuario.repository.ts      → igual + findByUsuario(), findByRol(), findActivos()

infrastructure/repositories/
  empleado.inmemory.repository.ts   ← Para tests (no se borró)
  empleado.supabase.repository.ts   ← NUEVO: implementación con Prisma (PostgreSQL)
  usuario.supabase.repository.ts    ← NUEVO: implementación con Prisma (PostgreSQL)
```

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Empleado {
  id          String   @id @default(uuid())
  cedula      String
  nombres     String
  salario     Float
  departamento String
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Usuario {
  id               String    @id @default(uuid())
  usuario          String    @unique
  passwordHash     String
  rol              String
  activo           Boolean   @default(true)
  ultimoAcceso     DateTime?
  especialidad     String?
  experienciaAnios Int?
  metaMensual      Float?
  areaResponsable  String?
  bonoGestion      Float?
  nivelPermiso     String?
  fechaCreacion    DateTime  @default(now())
}

model Vehiculo { ... }    // Pendiente de implementar
model PlanFinanciamiento { ... }  // Pendiente de implementar
```

### Conexión a Supabase

**Runtime** (`src/infrastructure/database/prisma.service.ts`):
```typescript
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client.js';

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

**CLI** (`prisma.config.ts`):
```typescript
datasource: { url: process.env["DATABASE_URL"] }
```

**.env**:
```
DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.xxxxx
DB_PASSWORD=password
PORT=3000
```
  id          String @id
  nombre      String
  tasaInteres Float
  // ... pendiente de implementar entidad
}
```

### Nuevos archivos (6)

| Archivo | Propósito |
|---------|-----------|
| `prisma/schema.prisma` | Schema con 4 modelos y `provider = "postgresql"` |
| `prisma.config.ts` | Configuración de Prisma 7 (lee `DATABASE_URL` de `.env`) |
| `prisma/seed.ts` | Poblado inicial con 5 empleados + 4 usuarios |
| `src/infrastructure/database/prisma.service.ts` | Singleton `PrismaClient` con adapter `PrismaPg` + `pg.Pool` |
| `src/infrastructure/repositories/empleado.supabase.repository.ts` | Implementación `EmpleadoRepository` con Prisma |
| `src/infrastructure/repositories/usuario.supabase.repository.ts` | Implementación `UsuarioRepository` con Prisma |

### Dependencias nuevas

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `prisma` | ^7.8.0 | ORM + CLI (migrate, generate) |
| `@prisma/client` | ^7.8.0 | Cliente generado para consultas |
| `@prisma/adapter-pg` | ^7.8.0 | Adapter PostgreSQL para Prisma 7 (usa `pg.Pool`) |
| `pg` | ^8.22.0 | Cliente PostgreSQL nativo |
| `dotenv` | ^17.4.2 | Carga variables de entorno desde `.env` |
| `@types/pg` | ^8.20.0 (dev) | Tipos para pg |

### Scripts nuevos en `package.json`

```json
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev --name init",
"prisma:seed": "tsx prisma/seed.ts",
"prisma:studio": "npx prisma studio"
```

### Cómo se switchea entre InMemory y Supabase

En `empleadoRoutes.ts` y `usuarioRoutes.ts` se cambia 1 línea:

```typescript
// Para desarrollo con persistencia (PostgreSQL/Supabase):
import { EmpleadoSupabaseRepository } from '...';
const repository = new EmpleadoSupabaseRepository();

// Para tests (sin depender de DB - usa datos en memoria):
// import { EmpleadoInMemoryRepository } from '...';
// const repository = new EmpleadoInMemoryRepository();
```

### Archivos modificados (4)

| Archivo | Cambio |
|---------|--------|
| `src/app.ts` | Se agregó `UsuarioRoutes` en `/api/usuarios` + `express.static` para servir UI estática |
| `src/interfaces/routes/empleadoRoutes.ts` | Switcheó a `EmpleadoSupabaseRepository` |
| `src/interfaces/routes/usuarioRoutes.ts` | Switcheó a `UsuarioSupabaseRepository` |
| `package.json` | Se agregó `"type": "module"`, scripts prisma, se eliminó `postinstall` |
| `.gitignore` | Se agregó `*.db`, `*.db-journal` |

---

## Frontend Estático (`src/interfaces/ui/`)

Se integró el frontend HTML+CSS estático al servidor Express:

- `GET /` → sirve `home.html` (landing page con catálogo de 8 vehículos)
- Archivos estáticos servidos desde `src/interfaces/ui/`

### Estructura del frontend estático

```
src/interfaces/ui/
├── home.html           → Página principal (catálogo, planes, testimonios)
├── cotizador.html      → Simulador de financiamiento (mock - readonly)
├── css/
│   └── styles.css      → CSS vanilla, 668 líneas, 7 secciones
└── resources/          → Imágenes: 8 vehículos, logo, iconos redes sociales
```

---

## Cómo ejecutar

### 1. Configurar Supabase (o PostgreSQL local)

Crea un proyecto en [Supabase](https://supabase.com) y edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.TU_PROYECTO.supabase.co:5432/postgres"
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.TU_PROYECTO
DB_PASSWORD=TU_PASSWORD
PORT=3000
```

### 2. Inicializar base de datos

```bash
cd AutoVentasPro
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 3. Tests (funcionan sin PostgreSQL - usan InMemory)

```bash
npm run test:empleado
```

### 4. Iniciar servidor

```bash
npm run dev
# Servidor en http://localhost:3000
```

### Endpoints disponibles:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Home page (frontend estático) |
| `GET` | `/api/employees` | Listar empleados |
| `POST` | `/api/employees` | Crear empleado |
| `GET` | `/api/employees/stats` | Estadísticas |
| `GET` | `/api/employees/:id` | Obtener empleado |
| `PUT` | `/api/employees/:id` | Actualizar empleado |
| `DELETE` | `/api/employees/:id` | Eliminar empleado |
| `PATCH` | `/api/employees/:id/salary` | Aumentar salario |
| `GET` | `/api/usuarios` | Listar usuarios |
| `POST` | `/api/usuarios` | Crear usuario |

## Próximos pasos

1. Configurar Supabase con tus credenciales en `.env`
2. Extraer `concesionaria-fe.rar` en la raíz del proyecto
3. Instalar dependencias del frontend React (`npm install`)
4. Conectar frontend React con backend (ya están alineados tipos y endpoints)
5. Continuar backlog: módulos Vehículo, PlanFinanciamiento, Cotización, Venta
