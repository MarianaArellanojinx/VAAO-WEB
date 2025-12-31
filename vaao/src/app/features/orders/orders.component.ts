import { Component, inject, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { CardComponent } from "../../shared/components/card/card.component";
import { ApiService } from '../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { DialogService } from 'primeng/dynamicdialog';
import { AddOrderComponent } from '../add-order/add-order.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Pedido } from '../../shared/interfaces/Pedido';
import { AlertService } from '../../core/services/alert.service';
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from '@angular/forms';
import { SpeedDialModule } from "primeng/speeddial";
import { MenuItem } from 'primeng/api';
import { ArrivalsDeliveryComponent } from '../arrivals-delivery/arrivals-delivery.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule, CommonModule, CalendarModule, FormsModule, SpeedDialModule],
  providers: [ApiService, DialogService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  ngOnInit(): void {
    this.getOrders()
    this.getRepartidores();
    this.userRole = this.auth.getUser().rol ?? 0
  }
  items: MenuItem[] = [
    {
      icon: 'pi pi-plus',
      command: () => {}
    }
  ];

  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private auth: AuthService = inject(AuthService);
  private alert: AlertService = inject(AlertService);

  readonly PENDIENTE: number = 1;
  readonly APROBADO: number = 2;
  readonly CANCELADO: number = 3;
  readonly EN_CAMINO: number = 1;
  readonly LLEGADA: number = 2;

  orders: Pedido[] = [];
  delivery: any[] = [];
  userRole: number = 0;
  repartidores: any[] = [];
  idRepartidor: number = 0;
  idCliente: number = 0;

  dates: Date[] = [new Date(), new Date()]

  getClientes() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        this.idCliente = response.data.filter((x: any) => x.idUser === this.auth.getUser().idUser)
      }
    })
  }
  openModal(){
    this.dialog.open(AddOrderComponent, {
      header: 'Crear pedido',
      width: '80%',
      baseZIndex: 9999
    })
  }
  openArrivals(order: Pedido){
    const entrega = this.delivery.filter(x => x.idPedido === order.idPedido)[0]
    this.dialog.open(ArrivalsDeliveryComponent, {
      header: 'Tomar evidencia',
      baseZIndex: 9999,
      width: '80%',
      data: entrega
    })
  }
  getOrders(): void {
    const start = this.dates[0].toISOString().split('T')[0];
    const end = this.dates[1].toISOString().split('T')[0];
    this.api.get<ResponseBackend<Pedido[]>>(`${environment.urlBackend}Pedidos/GetPedidosFiltrados?start=${start}&end=${end}`)
    .subscribe({
      next: response => {
        if(this.userRole === 1){
          this.orders = response.data
        }else if(this.userRole === 3){
          this.orders = response.data.filter(x => x.estatusPedido === this.APROBADO && x.idCliente === this.idCliente)
        }else{
          this.orders = response.data.filter(x => x.estatusPedido === this.PENDIENTE);
        }
        this.getDelivery()
      }
    })
  }
  getRepartidores() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Repartidores/GetRepartidores`).subscribe({
      next: response => {
        this.repartidores = response.data;
        this.idRepartidor = this.repartidores.filter(x => x.idUser === this.auth.getUser().idUser)[0].idRepartidor
      }
    });
  }
  createDelivery(order: Pedido){
    const payload = {
      idRepartidor: this.idRepartidor,
      idPedido: order.idPedido,
      fechaEntrega: null,
      horaInicio: new Date().toISOString(),
      horaRegreso: null,
      horaLlegada: null,
      estatusReparto: 1,
      observaciones: null,
      imagenConservadorLlegada: null,
      imagenConservadorSalida: null,
      imagenIncidenciaConservador: null
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Entregas/CreateEntrega`, payload).subscribe({
      next: response => {
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', 'Se ha iniciado la entrega del pedido.', 'success')
          this.getOrders()
        }
      }
    });
  }
  getDelivery(){
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Entregas/GetAllEntregas`)
    .subscribe({
      next: response => {
        this.delivery = response.data;
      }
    });
  }
  hasDelivery(pedido: Pedido){
    return this.delivery.filter(x => x.idPedido === pedido.idPedido).length > 0 ? true : false;
  }
  getStatusDelivery(pedido: Pedido){
    return this.delivery.filter(x => x.idPedido === pedido.idPedido)[0].estatusReparto
  }
  acceptOrder(order: Pedido){
    order.estatusPedido = this.APROBADO;
    this.api.patch<ResponseBackend<any>>(`${environment.urlBackend}Pedidos/UpdatePedido/${order.idPedido}`, order).subscribe({
      next: response => {
        this.alert.dinamycMessage('Hecho!!', 'Se ha aprobado el pedido', 'success');
      }
    });
  }
  cancelOrder(order: Pedido){
    order.estatusPedido = this.CANCELADO;
    this.api.patch<ResponseBackend<any>>(`${environment.urlBackend}Pedidos/UpdatePedido/${order.idPedido}`, order).subscribe({
      next: response => {
        this.alert.dinamycMessage('Ok', 'Se ha rechazado el pedido', 'error');
      }
    });
  }
}
