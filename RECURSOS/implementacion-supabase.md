# Implementación de Supabase + Prisma ORM

## Objetivo

Reemplazar el almacenamiento en memoria (`InMemoryRepository`) por una base de datos **PostgreSQL** gestionada con **Prisma ORM 7** y conectada a **Supabase**, sin modificar las interfaces de repositorio ni la lógica de negocio existente.

---

## 1. Arquitectura de Persistencia

```
┌─────────────────────────────────────────────────────┐
│  server.ts                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  app.ts                                       │   │
│  │  ┌────────────────────────────────────────┐   │   │
│  │  │  Routes (empleadoRoutes, usuarioRoutes) │   │   │
│  │  │  ┌──────────────────────────────────┐   │   │   │
│  │  │  │  Service (lógica de negocio)      │   │   │   │
│  │  │  │  ┌────────────────────────────┐   │   │   │   │
│  │  │  │  │  Repository (INTERFAZ)      │   │   │   │   │
│  │  │  │  └────────────────────────────┘   │   │   │   │
│  │  │  └──────────────────────────────────┘   │   │   │
│  │  └────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────┘   │
│                         │                           │
│  ┌──────────────────────▼───────────────────────┐   │
│  │  Implementación del repositorio               │   │
│  │                                               │   │
│  │  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │  InMemory        │  │  Supabase (Prisma)│   │   │
│  │  │  (tests/desarrollo│  │  (producción)    │   │   │
│  │  │   sin DB)        │  │                  │   │   │
│  │  └──────────────────┘  └──────┬───────────┘   │   │
│  │                               │               │   │
│  │                    ┌──────────▼──────────┐    │   │
│  │                    │  prisma.service.ts   │    │   │
│  │                    │  pg.Pool + PrismaPg  │    │   │
│  │                    │  → PrismaClient      │    │   │
│  │                    └─────────────────────┘    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Beneficios de esta arquitectura

- **Las interfaces no cambian**: `EmpleadoRepository`, `UsuarioRepository` siguen siendo el contrato
- **El Service no sabe qué repositorio usa**: recibe la interfaz por inyección de dependencias
- **Los tests usan InMemory**: no necesitan PostgreSQL corriendo
- **Producción usa Supabase**: solo se cambia 1 línea en routes para switchear

---

## 2. Prisma Schema

**Archivo:** `prisma/schema.prisma`

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

model Vehiculo {
  id               String   @id @default(uuid())
  nombre           String
  categoria        String
  precio           Float
  imagenUrl        String?
  especificaciones String?
  activo           Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model PlanFinanciamiento {
  id          String   @id @default(uuid())
  nombre      String
  tasaInteres Float
  plazoMin    Int
  plazoMax    Int
  entradaMin  Float
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Detalles importantes:**
- `provider = "postgresql"` — compatible con Supabase
- Todos los IDs usan `@default(uuid())` — generación automática de UUIDs
- `Vehiculo` y `PlanFinanciamiento` están modelados pero **pendientes de implementar** como entidades de dominio

---

## 3. Conexión a Supabase

### Runtime — `src/infrastructure/database/prisma.service.ts`

```typescript
import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client.js';

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
    if (!prisma) {
        const pool = new pg.Pool({
            host: process.env['DB_HOST'],
            port: Number(process.env['DB_PORT']),
            database: process.env['DB_NAME'],
            user: process.env['DB_USER'],
            password: process.env['DB_PASSWORD'],
        });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}
```

**Patrón Singleton**: solo existe una instancia de `PrismaClient` durante toda la vida de la aplicación.

### CLI (migraciones, generate) — `prisma.config.ts`

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

### Variables de entorno — `.env` (valores reales usados)

```env
# Base de datos (Supabase PostgreSQL via connection pooler - session mode)
DATABASE_URL="postgresql://postgres.ickuktmrjugshjzagfmu:yandri200523@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.ickuktmrjugshjzagfmu
DB_PASSWORD=yandri200523

# Servidor
PORT=3000
```

**¿Por qué dos configuraciones?**
- **`DATABASE_URL`** — usada por Prisma CLI (`migrate dev`, `generate`), formato de conexión estándar PostgreSQL
- **`DB_HOST`, `DB_PORT`, etc.** — usadas por `pg.Pool` en runtime, formato de conexión por componentes individuales

---

## 4. Repositorios con Prisma

### `EmpleadoSupabaseRepository` — `src/infrastructure/repositories/empleado.supabase.repository.ts`

Implementa `EmpleadoRepository` (la misma interfaz que `EmpleadoInMemoryRepository`):

| Método | Prisma Query | Descripción |
|--------|-------------|-------------|
| `save(empleado)` | `prisma.empleado.create({ data })` | Crear registro |
| `update(empleado)` | `prisma.empleado.update({ where: { id }, data })` | Actualizar registro |
| `delete(id)` | `prisma.empleado.delete({ where: { id } })` | Eliminar registro |
| `findById(id)` | `prisma.empleado.findUnique({ where: { id } })` | Buscar por ID |
| `findAll()` | `prisma.empleado.findMany()` | Listar todos |
| `count()` | `prisma.empleado.count()` | Contar registros |

### `UsuarioSupabaseRepository` — `src/infrastructure/repositories/usuario.supabase.repository.ts`

Implementa `UsuarioRepository`:

| Método | Prisma Query | Descripción |
|--------|-------------|-------------|
| `save(usuario)` | `prisma.usuario.create({ data })` | Crear registro |
| `update(usuario)` | `prisma.usuario.update({ where: { id }, data })` | Actualizar registro |
| `delete(id)` | `prisma.usuario.delete({ where: { id } })` | Eliminar registro |
| `findById(id)` | `prisma.usuario.findUnique({ where: { id } })` | Buscar por ID |
| `findAll()` | `prisma.usuario.findMany()` | Listar todos |
| `findByUsuario(usuario)` | `prisma.usuario.findUnique({ where: { usuario } })` | Buscar por username |
| `findByRol(rol)` | `prisma.usuario.findMany({ where: { rol } })` | Filtrar por rol |
| `findActivos()` | `prisma.usuario.findMany({ where: { activo: true } })` | Filtrar activos |
| `count()` | `prisma.usuario.count()` | Contar registros |

---

## 5. Switcheo entre InMemory y Supabase

En los archivos de rutas se cambia **1 sola línea**:

```typescript
// ─── src/interfaces/routes/empleadoRoutes.ts ─────────────────

// PRODUCCIÓN: usa PostgreSQL/Supabase
import { EmpleadoSupabaseRepository } from '../../infrastructure/repositories/empleado.supabase.repository.js';
const repository = new EmpleadoSupabaseRepository();

// DESARROLLO/TESTS: usa memoria (no requiere DB)
// import { EmpleadoInMemoryRepository } from '../../infrastructure/repositories/empleado.inmemory.repository.js';
// const repository = new EmpleadoInMemoryRepository();
```

El `EmpleadoInMemoryRepository` se **conserva** porque los tests lo usan y no depende de una base de datos externa.

---

## 6. Seed de Datos

**Archivo:** `prisma/seed.ts`

Puebla la base de datos con datos iniciales si está vacía:

| Tabla | Registros |
|-------|-----------|
| `Empleado` | Ana García, Carlos López, María Pérez, Pedro Ramírez, Laura Jiménez |
| `Usuario` | admin (administrador), jventas (jefe_ventas), carlos (asesor), maria (asesor) |

```bash
npm run prisma:seed
```

---

## 7. Resultados de la Implementación (Verificado)

La conexión con Supabase se verificó exitosamente el **6 de julio de 2026** con los siguientes resultados:

### Migración (`npx prisma migrate dev --name init`)

```
Aplicada: 20260706063428_init
Tablas creadas: Empleado, Usuario, Vehiculo, PlanFinanciamiento
Base de datos: PostgreSQL en Supabase (pooler session mode, puerto 5432)
```

### Seed (`npm run prisma:seed`)

| Registro | Estado |
|----------|--------|
| Ana García (Ventas) | ✅ Insertado |
| Carlos López (Tecnología) | ✅ Insertado |
| María Pérez (Marketing) | ✅ Insertado |
| Pedro Ramírez (Finanzas) | ✅ Insertado |
| Laura Jiménez (Ventas) | ✅ Insertado |
| admin (administrador) | ✅ Insertado |
| jventas (jefe_ventas) | ✅ Insertado |
| carlos (asesor) | ✅ Insertado |
| maria (asesor) | ✅ Insertado |

### Endpoints verificados

| Endpoint | Método | Respuesta |
|----------|--------|-----------|
| `GET /api/employees` | ✅ | 5 empleados con datos correctos |
| `GET /api/usuarios` | ✅ | 4 usuarios con roles y datos completos |
| `GET /` (frontend estático) | ✅ | Home page con catálogo de 8 vehículos |

### Conexión establecida mediante

```
Pooler:  aws-1-us-east-2.pooler.supabase.com:5432 (session mode)
Adapter: @prisma/adapter-pg v7.8.0 + pg.Pool v8.22.0
Cliente: Prisma Client v7.8.0 generado en generated/prisma/
```

---

## 8. Dependencias Instaladas

| Paquete | Versión | Rol |
|---------|---------|-----|
| `prisma` | ^7.8.0 | ORM + CLI |
| `@prisma/client` | ^7.8.0 | Cliente generado |
| `@prisma/adapter-pg` | ^7.8.0 | Adapter PostgreSQL para Prisma 7 |
| `pg` | ^8.22.0 | Cliente PostgreSQL nativo |
| `dotenv` | ^17.4.2 | Carga de `.env` |
| `@types/pg` | ^8.20.0 | Tipos TypeScript para pg |

---

## 9. Scripts Disponibles

```bash
npm run prisma:generate   # Genera Prisma Client
npm run prisma:migrate    # Ejecuta migraciones
npm run prisma:seed       # Puebla datos iniciales
npm run prisma:studio     # Abre Prisma Studio (GUI)
npm run test:empleado     # Tests (NO requieren PostgreSQL)
npm run dev               # Inicia servidor Express
```

---

## 10. Flujo Completo de Configuración Inicial

```bash
# 1. Clonar repositorio e instalar
cd AutoVentasPro
npm install

# 2. Configurar Supabase
#    - Crear proyecto en https://supabase.com
#    - Ir a Project Settings → Database → Connection string
#    - Copiar los datos a .env

# 3. Inicializar base de datos
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# 4. Verificar conexión
npm run dev
# Visitar http://localhost:3000/api/employees

# 5. Ejecutar tests (sin PostgreSQL)
npm run test:empleado
```

---

## 11. Comparativa: Antes vs Después

| Aspecto | Antes (InMemory) | Después (Supabase) |
|---------|------------------|-------------------|
| Persistencia | ❌ Se pierde al reiniciar | ✅ Persiste en PostgreSQL |
| Velocidad | ✅ Instantáneo | 🟡 Depende de red/DB |
| Dependencia externa | ❌ Ninguna | ✅ Requiere Supabase/PostgreSQL |
| Tests | ✅ Rápidos, aislados | ✅ Siguen usando InMemory |
| Producción | ❌ No viable | ✅ Listo para deploy |
| Complejidad | ✅ Baja | 🟡 Media (requiere config) |

---

## 12. Referencia

Este patrón de implementación está basado en el proyecto `proyecto_bienesyraices1`, siguiendo la misma estructura:
- `prisma.service.ts` con `pg.Pool` + `PrismaPg` adapter
- Repositorios que importan el singleton de Prisma
- Prisma schema con `provider = "postgresql"` y `output` personalizado
- `prisma.config.ts` para CLI con `DATABASE_URL`
- Variables de entorno separadas para runtime (`DB_HOST`, etc.) y CLI (`DATABASE_URL`)
