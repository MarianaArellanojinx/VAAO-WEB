export interface Pedido {
  idPedido: number;
  idCliente: number;
  nombreCliente: string;
  fechaPedido: Date;
  fechaProgramada: Date;
  totalBolsas: number;
  precioUnitario: number;
  totalPagar: number;
  estatusPedido: number;
  observaciones: string;
  idRepartidor: number;
  estatusTexto?: string;
}