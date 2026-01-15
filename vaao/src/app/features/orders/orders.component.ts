import { Component, inject, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
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
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from "primeng/dropdown";
import { DateService } from '../../core/services/date.service';
import { CardDashboardComponent } from "../../shared/components/card-dashboard/card-dashboard.component";
import { FinishOrderComponent } from '../finish-order/finish-order.component';
import { ViewDetailsComponent } from '../view-details/view-details.component';
import { MapsService } from '../../core/services/maps.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    Button,
    TableModule,
    HttpClientModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    SpeedDialModule,
    DialogModule,
    DropdownModule,
    CardDashboardComponent
],
  providers: [ApiService, DialogService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  ngOnInit(): void {
    this.userRole = this.auth.getUser()?.rol ?? 0
    this.getClientes();
    this.getRepartidores();
  }
  ngAfterViewInit(): void {
    this.isAndroid = Capacitor.getPlatform() === 'android';
    console.log(this.isAndroid);
  }

  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private auth: AuthService = inject(AuthService);
  private alert: AlertService = inject(AlertService);
  private date: DateService = inject(DateService);
  private maps: MapsService = inject(MapsService);

  readonly PENDIENTE: number = 1;
  readonly APROBADO: number = 2;
  readonly CANCELADO: number = 3;

  readonly EN_CAMINO: number = 1;
  readonly LLEGADA: number = 2;
  readonly FINALIZADO: number = 3;

  isAndroid: boolean = false;
  orderAux: Pedido | undefined = undefined;
  selectedDelivery: number = 0;
  modalRepartidor: boolean = false;
  orders: Pedido[] = [];
  delivery: any[] = [];
  userRole: number = 0;
  repartidores: any[] = [];
  idRepartidor: number = 0;
  idCliente: number = 0;
  dates: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)]
  cols: {field: string, header: string, customExportHeader?: string}[] = [
    {
      field: 'idPedido',
      header: 'Pedido',
      customExportHeader: 'Folio del pedido'
    },
    {
      field: 'nombreCliente',
      header: 'Nombre',
      customExportHeader: 'Nombre del cliente'
    },
    {
      field: 'fechaPedido',
      header: 'Fecha',
      customExportHeader: 'Fecha del pedido'
    },
    {
      field: 'fechaProgramada',
      header: 'Programada',
      customExportHeader: 'Fecha de entrega programada'
    },
    {
      field: 'totalBolsas',
      header: 'Total',
      customExportHeader: 'Total de bolsas'
    },
    {
      field: 'precioUnitario',
      header: 'precio',
      customExportHeader: 'Precio por bolsa'
    },
    {
      field: 'totalPagar',
      header: 'totalPagar',
      customExportHeader: 'Total a pagar'
    },
    {
      field: 'estatusTexto',
      header: 'estatus',
      customExportHeader: 'Estatus del pedido'
    }
  ]

  isValidDelivery: () => boolean = () => this.selectedDelivery > 0;
  getClientes() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        if(this.userRole === 4){
          this.idCliente = response.data.filter((x: any) => x.idUser === this.auth.getUser()?.idUser)[0].idCliente
        }
        this.getOrders();
      }
    })
  }
  openModal(){
    const modal = this.dialog.open(AddOrderComponent, {
      header: 'Crear pedido',
      width: '80%',
      baseZIndex: 9999
    });
    modal?.onClose.subscribe({
      next: response => this.getOrders()
    })
  }
  openArrivals(order: Pedido){
    const entrega = this.delivery.filter(x => x.idPedido === order.idPedido)[0]
    this.dialog.open(ArrivalsDeliveryComponent, {
      header: 'Tomar evidencia',
      baseZIndex: 9999,
      width: 'auto',
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
          this.orders = response.data.filter(p => p.estatusPedido === this.APROBADO || p.estatusPedido === this.PENDIENTE)
        }else if(this.userRole === 2){
          this.orders = response.data.filter(x => x.estatusPedido === this.APROBADO || x.estatusPedido === this.PENDIENTE)
        }else if(this.userRole === 3){
          this.orders = response.data.filter(x => x.estatusPedido === this.APROBADO)
        }else{
          this.orders = response.data.filter(x => x.idCliente === this.idCliente);
        }
        this.orders = this.orders.map(p => ({
          ...p,
          estatusTexto: 
            p.estatusPedido === this.PENDIENTE ? 'Pendiente de aprobación' : 
            p.estatusPedido === this.APROBADO ? 'Aprobado' : 
            'Cancelado/Rechazado'
        }))
        this.getDelivery()
      }
    })
  }
  getRepartidores() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Repartidores/GetRepartidores`).subscribe({
      next: response => {
        console.log(this.repartidores)
        this.repartidores = response.data;
        if(this.userRole === 3){
          this.idRepartidor = this.repartidores.filter(x => x.idUser === this.auth.getUser()?.idUser)[0].idRepartidor
        }
      }
    });
  }
  createDelivery(order: any){
    const payload = {
      idRepartidor: this.idRepartidor,
      idPedido: order.idPedido,
      fechaEntrega: null,
      horaInicio: new Date().toISOString(),
      horaRegreso: null,
      horaLlegada: null,
      estatusReparto: this.EN_CAMINO,
      observaciones: null,
      imagenConservadorLlegada: null,
      imagenConservadorSalida: null,
      imagenIncidenciaConservador: null
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Entregas/CreateEntrega`, payload).subscribe({
      next: response => {
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', 'Se ha iniciado la entrega del pedido.', 'success')
          this.getOrders();
          this.maps.openMaps(order.ubicacion)
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
    this.modalRepartidor = true;
    this.orderAux = order;
  }
  acceptOrderApi(): void {
    if (this.orderAux !== undefined) {
      this.orderAux.idRepartidor = this.selectedDelivery;
      this.orderAux.estatusPedido = this.APROBADO;
      this.api.patch<ResponseBackend<boolean>>(`${environment.urlBackend}Pedidos/UpdatePedido/${this.orderAux.idPedido}`, this.orderAux)
        .subscribe({
          next: response => {
            this.alert.dinamycMessage('Hecho!!', 'Se ha aprobado el pedido', 'success');
            this.modalRepartidor = false;
            this.selectedDelivery = 0;
            this.orderAux = undefined;
            this.orders.filter(p => p.idPedido === this.orderAux?.idPedido)[0].estatusPedido = this.APROBADO;
          }
        });
    }
  }
  hideModal() {
    this.selectedDelivery = 0;
    this.orderAux = undefined;
    this.modalRepartidor = false;
  }
  cancelOrder(order: Pedido){
    order.estatusPedido = this.CANCELADO;
    this.api.patch<ResponseBackend<any>>(`${environment.urlBackend}Pedidos/UpdatePedido/${order.idPedido}`, order).subscribe({
      next: response => {
        this.orders = this.orders.filter(x => x.idPedido !== order.idPedido);
        this.alert.dinamycMessage('Ok', 'Se ha rechazado el pedido', 'error');
      }
    });
  }
  openFinish(order: Pedido): void {
    const e = this.delivery.filter((e: any) => e.idPedido === order.idPedido)[0];
    this.dialog.open(FinishOrderComponent, {
      header: 'Finalizar pedido',
      baseZIndex: 9999,
      data: {
        Pedido: order,
        Entrega: e
      }
    })
  }
  openDetail(order: Pedido): void {
    this.dialog.open(ViewDetailsComponent, {
      header: 'Detalles del pedido',
      baseZIndex: 9999,
      data: order.idPedido,
      width: 'auto'
    })
  }
}
