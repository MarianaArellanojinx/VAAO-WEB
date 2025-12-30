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

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule, CommonModule, CalendarModule, FormsModule],
  providers: [ApiService, DialogService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  ngOnInit(): void {
    this.getOrders()
    this.userRole = this.auth.getUser().rol ?? 0
  }

  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private auth: AuthService = inject(AuthService);
  private alert: AlertService = inject(AlertService);

  private readonly PENDIENTE: number = 1;
  private readonly APROBADO: number = 2;
  private readonly CANCELADO: number = 3;

  orders: Pedido[] = [];
  userRole: number = 0;

  dates: Date[] = [new Date(), new Date()]

  openModal(){
    this.dialog.open(AddOrderComponent, {
      header: 'Crear pedido',
      width: '80%',
      baseZIndex: 9999
    })
  }
  getOrders(): void {
    const start = this.dates[0].toISOString().split('T')[0];
    const end = this.dates[1].toISOString().split('T')[0];
    this.api.get<ResponseBackend<Pedido[]>>(`${environment.urlBackend}Pedidos/GetPedidosFiltrados?start=${start}&end=${end}`)
    .subscribe({
      next: response => {
        this.orders = response.data.filter(x => x.estatusPedido === this.PENDIENTE);
      }
    })
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
