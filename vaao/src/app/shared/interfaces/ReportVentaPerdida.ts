export interface ReportVentaPerdida {
  idCliente: number;
  nombreCliente: string;
  nombreNegocio: string;
  anioSemana: number;
  numeroSemana: number;
  inicioSemana: string;
  finSemana: string;
  bolsasObjetivo: number;
  bolsasCompradas: number;
  bolsasPerdidas: number;
  totalPagado: number;
  cumplioObjetivo: boolean;
}

export interface ReportVentaPerdidaResumen {
  metaBolsasPorSemana: number;
  totalNegocios: number;
  totalSemanas: number;
  totalRegistros: number;
  totalBolsasObjetivo: number;
  totalBolsasCompradas: number;
  totalBolsasPerdidas: number;
  negociosConFaltante: number;
  negociosSinCompras: number;
  porcentajeCumplimiento: number;
}

export interface ReportVentaPerdidaResponse {
  resumen: ReportVentaPerdidaResumen;
  detalle: ReportVentaPerdida[];
}
