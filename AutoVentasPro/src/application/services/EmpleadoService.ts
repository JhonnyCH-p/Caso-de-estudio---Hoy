import type { EmpleadoRepository } from '../../domain/repositories/empleado.repository.js';
import { Empleado } from '../../domain/entities/empleado.entity.js';
import type { CrearEmpleadoRequest, ActualizarEmpleadoRequest } from '../dtos/requests/EmpleadoRequest.js';
import type { EmpleadoResponse, EmpleadoStatsResponse } from '../dtos/responses/EmpleadoResponse.js';

export class EmpleadoService {
    constructor(private repository: EmpleadoRepository) {}

    async crearEmpleado(request: CrearEmpleadoRequest): Promise<EmpleadoResponse> {
        this.validarCrear(request);

        const empleado = Empleado.crear(
            request.cedula,
            request.nombres,
            request.salario,
            request.departamento,
        );

        await this.repository.save(empleado);
        return this.toResponse(empleado);
    }

    async listarEmpleados(activos?: boolean): Promise<EmpleadoResponse[]> {
        const todos = await this.repository.findAll();
        const empleados = activos ? todos.filter(e => e.isActivo()) : todos;
        return empleados.map(e => this.toResponse(e));
    }

    async obtenerEmpleadoPorId(id: string): Promise<EmpleadoResponse> {
        const empleado = await this.repository.findById(id);
        if (!empleado) throw new Error(`Empleado con ID ${id} no encontrado`);
        return this.toResponse(empleado);
    }

    async actualizarEmpleado(id: string, request: ActualizarEmpleadoRequest): Promise<EmpleadoResponse> {
        const empleado = await this.repository.findById(id);
        if (!empleado) throw new Error(`Empleado con ID ${id} no encontrado`);

        const data = empleado.toJSON();

        if (request.nombres !== undefined) data.nombres = request.nombres.trim();
        if (request.salario !== undefined) {
            if (request.salario < 0) throw new Error('El salario no puede ser negativo');
            data.salario = request.salario;
        }
        if (request.departamento !== undefined) data.departamento = request.departamento.trim();
        if (request.activo !== undefined) data.activo = request.activo;

        data.updatedAt = new Date().toISOString();

        const actualizado = Empleado.desdeDatos(data);
        await this.repository.update(actualizado);
        return this.toResponse(actualizado);
    }

    async eliminarEmpleado(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) throw new Error(`Empleado con ID ${id} no encontrado`);
    }

    async aumentarSalario(id: string, percentage: number): Promise<EmpleadoResponse> {
        if (percentage <= 0 || percentage > 100) {
            throw new Error('El porcentaje debe estar entre 1 y 100');
        }

        const empleado = await this.repository.findById(id);
        if (!empleado) throw new Error(`Empleado con ID ${id} no encontrado`);

        empleado.aumentarSalario(percentage);
        await this.repository.update(empleado);
        return this.toResponse(empleado);
    }

    async obtenerEstadisticas(): Promise<EmpleadoStatsResponse> {
        const todos = await this.repository.findAll();

        if (todos.length === 0) {
            return { total: 0, averageSalary: 0, maxSalary: 0, minSalary: 0 };
        }

        const salarios = todos.map(e => e.getSalario());
        const total = todos.length;
        const sum = salarios.reduce((a, b) => a + b, 0);
        const maxSalary = Math.max(...salarios);
        const minSalary = Math.min(...salarios);
        const averageSalary = total > 0 ? sum / total : 0;

        return { total, averageSalary, maxSalary, minSalary };
    }

    private validarCrear(request: CrearEmpleadoRequest): void {
        if (!request.cedula || request.cedula.trim().length < 10) {
            throw new Error('La cédula debe tener al menos 10 caracteres');
        }
        if (!request.nombres || request.nombres.trim().length < 2) {
            throw new Error('Los nombres deben tener al menos 2 caracteres');
        }
        if (request.salario === undefined || request.salario < 0) {
            throw new Error('El salario no puede ser negativo');
        }
    }

    private toResponse(empleado: Empleado): EmpleadoResponse {
        return {
            id: empleado.getId(),
            cedula: empleado.getCedula(),
            nombres: empleado.getNombres(),
            salario: empleado.getSalario(),
            departamento: empleado.getDepartamento(),
            activo: empleado.isActivo(),
            createdAt: empleado.getCreatedAt(),
            updatedAt: empleado.getUpdatedAt(),
        };
    }
}
