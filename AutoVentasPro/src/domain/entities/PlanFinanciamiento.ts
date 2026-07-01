export class PlanFinanciamiento {
  constructor(
    public idPlan: string,
    public nombre: string,
    public entradaMinima: number,
    public tasaInteresAnual: number,
    public plazosDisponibles: number[],
    public comision: number,
    public activo: boolean = true,
    public fechaCreacion: Date = new Date()
  ) {}

  calcularCuota(montoFinanciado: number, plazoMeses: number): number {
    if (!this.plazosDisponibles.includes(plazoMeses)) {
      throw new Error(`Plazo ${plazoMeses} no disponible`);
    }
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    if (tasaMensual === 0) return montoFinanciado / plazoMeses;
    const cuota = montoFinanciado * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses) /
                  (Math.pow(1 + tasaMensual, plazoMeses) - 1);
    return Math.round(cuota * 100) / 100;
  }

  desactivar(): void {
    this.activo = false;
  }
}