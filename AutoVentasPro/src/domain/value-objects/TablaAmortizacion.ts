export interface FilaAmortizacion {
    cuota: number;
    capital: number;
    interes: number;
    saldo: number;
}

export class TablaAmortizacion {
    private filas: FilaAmortizacion[];

    constructor(filas: FilaAmortizacion[]) {
        if (!filas || filas.length === 0) throw new Error('La tabla de amortización debe tener al menos una fila');
        this.filas = filas;
    }

    static generar(
        monto: number,
        tasaInteresAnual: number,
        plazoMeses: number,
        cuotaMensual: number,
    ): TablaAmortizacion {
        const filas: FilaAmortizacion[] = [];
        const tasaMensual = tasaInteresAnual / 100 / 12;
        let saldo = monto;

        for (let i = 1; i <= plazoMeses; i++) {
            const interes = Math.round(saldo * tasaMensual * 100) / 100;
            const capital = Math.round((cuotaMensual - interes) * 100) / 100;
            saldo = Math.round((saldo - capital) * 100) / 100;
            if (saldo < 0) saldo = 0;
            filas.push({ cuota: i, capital, interes, saldo });
        }

        return new TablaAmortizacion(filas);
    }

    getFilas(): FilaAmortizacion[] { return this.filas; }
    getTotalIntereses(): number {
        return Math.round(this.filas.reduce((sum, f) => sum + f.interes, 0) * 100) / 100;
    }
    getTotalPagado(): number {
        const ultima = this.filas[this.filas.length - 1];
        const totalCapital = this.filas.reduce((sum, f) => sum + f.capital, 0);
        const totalInteres = this.getTotalIntereses();
        return Math.round((totalCapital + totalInteres) * 100) / 100;
    }

    toJSON(): FilaAmortizacion[] {
        return this.filas.map(f => ({ ...f }));
    }
}
