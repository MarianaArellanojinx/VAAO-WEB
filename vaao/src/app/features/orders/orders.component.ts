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

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule, CommonModule],
  providers: [ApiService, DialogService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  ngOnInit(): void {
    this.getOrders()
  }

  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);

  orders: any[] = [];

  openModal(){
    this.dialog.open(AddOrderComponent, {
      header: 'Crear pedido',
      width: '80%',
      baseZIndex: 9999
    })
  }
  getOrders(): void {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Pedidos/GetPedidos`).subscribe({
      next: response => {
        this.orders = response.data;
      }
    })
  }

}
