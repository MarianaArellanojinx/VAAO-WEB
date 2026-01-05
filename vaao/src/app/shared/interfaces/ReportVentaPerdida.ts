export interface ReportVentaPerdida {
    nombrecliente: string;
    totalbolsas: number;
    numsemana: number;
    cumplio: boolean;
    faltanteCompra?: number;
}