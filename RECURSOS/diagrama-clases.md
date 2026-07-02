# Diagrama de Clases - AutoVentas Pro

## Entidades de Dominio

```mermaid
classDiagram
    class Vehiculo {
        <<Entity>>
        - props: VehiculoData
        +create(marca, modelo, anio, precioBase, tipo, stock, especificaciones) Vehiculo
        +fromData(data) Vehiculo
        +actualizar(data) void
        +ajustarStock(cantidad) void
        +estaDisponible() boolean
        +getId() string
        +getMarca() string
        +getModelo() string
        +getAnio() number
        +getPrecioBase() number
        +getTipo() string
        +getStock() number
        +getEspecificaciones() object
        +toJSON() VehiculoData
    }

    class VehiculoData {
        <<interface>>
        +id: string
        +marca: string
        +modelo: string
        +anio: number
        +precioBase: number
        +tipo: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'DEPORTIVO'
        +stock: number
        +especificaciones: object
        +createdAt: Date
        +updatedAt: Date
    }

    class PlanFinanciamiento {
        <<Entity>>
        +idPlan: string
        +nombre: string
        +entradaMinima: number
        +tasaInteresAnual: number
        +plazosDisponibles: number[]
        +comision: number
        +activo: boolean
        +fechaCreacion: Date
        +calcularCuota(montoFinanciado, plazoMeses) number
        +desactivar() void
    }

    class Usuario {
        <<Entity>>
        - id: string
        - usuario: string
        - passwordHash: string
        - rol: RolUsuario
        - activo: boolean
        - ultimoAcceso: Date | null
        - especialidad: string (opcional)
        - experienciaAnios: number (opcional)
        - metaMensual: number (opcional)
        - areaResponsable: string (opcional)
        - bonoGestion: number (opcional)
        - nivelPermiso: string (opcional)
        - fechaCreacion: Date
        +crear(usuario, passwordHash, rol, extras) Usuario
        +desdeDatos(data) Usuario
        +esRol(rol) boolean
        +esAsesor() boolean
        +esJefeVentas() boolean
        +esAdministrador() boolean
        +verificarPassword(passwordHash) boolean
        +cambiarPassword(nuevoHash) void
        +registrarAcceso() void
        +activar() void
        +desactivar() void
        +calcularComision(valorVenta) number
        +toJSON() DatosUsuario
    }

    class DatosUsuario {
        <<interface>>
        +id: string
        +usuario: string
        +passwordHash: string
        +rol: RolUsuario
        +activo: boolean
        +ultimoAcceso: Date | null
        +especialidad: string
        +experienciaAnios: number
        +metaMensual: number
        +areaResponsable: string
        +bonoGestion: number
        +nivelPermiso: string
        +fechaCreacion: Date
    }

    class RolUsuario {
        <<enum>>
        asesor
        jefe_ventas
        administrador
    }

    class Cotizacion {
        <<Entity>>
        - id: string
        - fecha: Date
        - vehiculoId: string
        - planId: string
        - entradaMonto: number
        - plazoMeses: number
        - cuotaMensual: number
        - totalInteres: number
        - totalFinanciado: number
        - tablaAmortizacion: TablaAmortizacion[]
        - cliente: ClienteInfo
        - asesorId: string
        - estado: EstadoCotizacion
        +crear(vehiculoId, planId, entrada, plazo, cliente) Cotizacion
        +calcularAmortizacion() void
        +asignarAsesor(asesorId) void
        +cambiarEstado(estado) void
        +toJSON() CotizacionData
    }

    class TablaAmortizacion {
        <<ValueObject>>
        +numeroCuota: number
        +fechaPago: Date
        +saldoInicial: number
        +capitalAmortizado: number
        +interesPagado: number
        +cuotaTotal: number
        +saldoFinal: number
    }

    class ClienteInfo {
        <<ValueObject>>
        +nombre: string
        +identificacion: string
        +email: string
        +telefono: string
        +ciudad: string
    }

    class EstadoCotizacion {
        <<enum>>
        pendiente
        aprobada
        rechazada
        expirada
    }

    class Venta {
        <<Entity>>
        - id: string
        - fecha: Date
        - cotizacionId: string
        - vehiculoId: string
        - asesorId: string
        - valorTotal: number
        - planFinanciamientoId: string
        - estado: EstadoVenta
        +crear(cotizacionId, vehiculoId, asesorId, valorTotal, planId) Venta
        +cerrar() void
        +anular() void
        +toJSON() VentaData
    }

    class EstadoVenta {
        <<enum>>
        cerrada
        anulada
    }

    %% ============================================
    %% RELACIONES CON CARDINALIDADES
    %% ============================================

    %% Implementaciones de interfaz
    Vehiculo ..|> VehiculoData : implementa
    Usuario ..|> DatosUsuario : implementa

    %% Cotizacion → Vehiculo (Muchos a Uno)
    Cotizacion "*" --> "1" Vehiculo : referencia

    %% Cotizacion → PlanFinanciamiento (Muchos a Uno)
    Cotizacion "*" --> "1" PlanFinanciamiento : usa

    %% Cotizacion → Usuario/Asesor (Muchos a Uno)
    Cotizacion "*" --> "1" Usuario : asignado a

    %% Cotizacion → TablaAmortizacion (Composición - Uno a Muchos)
    Cotizacion "1" *-- "*" TablaAmortizacion : compuesta por

    %% Cotizacion → ClienteInfo (Composición - Uno a Uno)
    Cotizacion "1" *-- "1" ClienteInfo : pertenece a

    %% Cotizacion → EstadoCotizacion (uso de enum)
    Cotizacion ..> EstadoCotizacion : usa

    %% Venta → Cotizacion (Uno a Uno)
    Venta "1" --> "1" Cotizacion : se origina de

    %% Venta → Vehiculo (Muchos a Uno)
    Venta "*" --> "1" Vehiculo : vende

    %% Venta → Usuario/Asesor (Muchos a Uno)
    Venta "*" --> "1" Usuario : cerrada por

    %% Venta → PlanFinanciamiento (Muchos a Uno)
    Venta "*" --> "1" PlanFinanciamiento : usa

    %% Venta → EstadoVenta (uso de enum)
    Venta ..> EstadoVenta : usa

    %% Usuario → RolUsuario (uso de enum)
    Usuario ..> RolUsuario : tiene
```

---

## Resumen de Entidades

| Entidad | Propósito | Atributos Clave |
|---------|-----------|-----------------|
| **Vehiculo** | Vehículo del catálogo | marca, modelo, año, precioBase, tipo, stock |
| **PlanFinanciamiento** | Opciones de crédito | tasaInteresAnual, plazosDisponibles, entradaMinima |
| **Usuario** | Persona con acceso (3 roles) | usuario, passwordHash, rol (asesor/jefe_ventas/admin) |
| **Cotizacion** | Simulación financiera | vehiculoId, planId, cuotaMensual, tablaAmortizacion |
| **Venta** | Cierre de venta exitosa | cotizacionId, asesorId, valorTotal, estado |

## Value Objects

| Objeto | Descripción |
|--------|-------------|
| **TablaAmortizacion** | Desglose cuota por cuota (capital + interés) |
| **ClienteInfo** | Datos del cliente potencial |

## Enumeraciones

| Enumeración | Valores |
|-------------|---------|
| **RolUsuario** | asesor, jefe_ventas, administrador |
| **EstadoCotizacion** | pendiente, aprobada, rechazada, expirada |
| **EstadoVenta** | cerrada, anulada |

---

## Cardinalidades del Diagrama

| Origen | Cardinalidad | Destino | Cardinalidad | Tipo | Significado |
|--------|:-----------:|---------|:-----------:|------|-------------|
| **Cotizacion** | `*` (muchas) | **Vehiculo** | `1` (uno) | Asociación | Un vehículo puede tener muchas cotizaciones; cada cotización referencia un solo vehículo |
| **Cotizacion** | `*` (muchas) | **PlanFinanciamiento** | `1` (uno) | Asociación | Un plan puede estar en muchas cotizaciones; cada cotización usa un solo plan |
| **Cotizacion** | `*` (muchas) | **Usuario** (asesor) | `1` (uno) | Asociación | Un asesor atiende muchas cotizaciones; cada cotización tiene un asesor asignado |
| **Cotizacion** | `1` (una) | **TablaAmortizacion** | `*` (muchas) | **Composición** | Una cotización contiene muchas filas de amortización; si se elimina la cotización, se eliminan las filas |
| **Cotizacion** | `1` (una) | **ClienteInfo** | `1` (uno) | **Composición** | Una cotización tiene un solo cliente; el cliente no existe sin la cotización |
| **Venta** | `1` (una) | **Cotizacion** | `1` (una) | Asociación | Una venta se origina de una única cotización; una cotización genera una única venta |
| **Venta** | `*` (muchas) | **Vehiculo** | `1` (uno) | Asociación | Un vehículo (modelo) puede venderse muchas veces; cada venta vende un vehículo |
| **Venta** | `*` (muchas) | **Usuario** (asesor) | `1` (uno) | Asociación | Un asesor cierra muchas ventas; cada venta es cerrada por un asesor |
| **Venta** | `*` (muchas) | **PlanFinanciamiento** | `1` (uno) | Asociación | Un plan puede estar en muchas ventas; cada venta usa un plan |

**Notación:**
- `1` → exactamente uno
- `*` → cero o muchos
- **Composición** (`*--`) → el ciclo de vida del hijo depende del padre (si el padre se elimina, el hijo también)
