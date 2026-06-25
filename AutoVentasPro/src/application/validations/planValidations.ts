import { PlanFinanciamientoRequest } from '../dtos/requests/PlanFinanciamientoRequest.js';

export function validatePlanRequest(data: PlanFinanciamientoRequest): void {
  if (!data.nombre?.trim()) throw new Error('Nombre obligatorio');
  if (data.entradaMinima < 0 || data.entradaMinima > 100) throw new Error('Entrada mínima debe ser 0-100');
  if (data.tasaInteresAnual < 0) throw new Error('Tasa debe ser >= 0');
  if (!data.plazosDisponibles?.length) throw new Error('Debe haber al menos un plazo');
  if (data.plazosDisponibles.some(p => p <= 0)) throw new Error('Plazos deben ser positivos');
  if (data.comision < 0) throw new Error('Comisión debe ser >= 0');
}