import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../infrastructure/api.service';
import { DateService } from '../../core/services/date.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { Pedido } from '../../shared/interfaces/Pedido';
import { environment } from '../../../environments/environment';
import { CardDashboardComponent } from '../../shared/components/card-dashboard/card-dashboard.component';

interface ClientOrdersGroup {
  key: string;
  idCliente: number;
  nombreCliente: string;
  pedidos: Pedido[];
  totalPedidos: number;
  totalBolsas: number;
  totalPagar: number;
  pendientes: number;
  aprobados: number;
  cancelados: number;
}

@Component({
  selector: 'app-orders-by-client',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    Button,
    TableModule,
    TagModule,
    InputTextModule,
    HttpClientModule,
    CardDashboardComponent
  ],
  providers: [ApiService],
  templateUrl: './orders-by-client.component.html',
  styleUrl: './orders-by-client.component.scss'
})
export class OrdersByClientComponent implements OnInit {

  private readonly api: ApiService = inject(ApiService);
  private readonly date: DateService = inject(DateService);

  readonly PENDIENTE: number = 1;
  readonly APROBADO: number = 2;
  readonly CANCELADO: number = 3;

  dates: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)];
  query: string = '';
  loading: boolean = false;
  groups: ClientOrdersGroup[] = [];

  get startDateForCard(): Date {
    return this.dates[0] ?? new Date();
  }

  get endDateForCard(): Date {
    return this.dates[1] ?? this.startDateForCard;
  }

  ngOnInit(): void {
    this.getOrdersByClient();
  }

  get filteredGroups(): ClientOrdersGroup[] {
    const value = this.query.trim().toLowerCase();
    if (value === '') return this.groups;

    return this.groups.filter(group =>
      group.nombreCliente.toLowerCase().includes(value) ||
      group.idCliente.toString().includes(value) ||
      group.pedidos.some(order => order.idPedido.toString().includes(value))
    );
  }

  getOrdersByClient(): void {
    const startDate = this.dates[0] ?? new Date();
    const endDate = this.dates[1] ?? startDate;
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    this.loading = true;
    this.api.get<ResponseBackend<Pedido[]>>(`${environment.urlBackend}Pedidos/GetPedidosFiltrados?start=${start}&end=${end}`)
      .subscribe({
        next: response => {
          const orders = (response.data ?? []).map(order => ({
            ...order,
            estatusTexto: this.getStatusText(order.estatusPedido)
          }));
          this.groups = this.groupOrdersByClient(orders);
          this.loading = false;
        },
        error: () => {
          this.groups = [];
          this.loading = false;
        }
      });
  }

  getStatusSeverity(status: number): 'warning' | 'success' | 'danger' | 'info' {
    if (status === this.PENDIENTE) return 'warning';
    if (status === this.APROBADO) return 'success';
    if (status === this.CANCELADO) return 'danger';
    return 'info';
  }

  private getStatusText(status: number): string {
    if (status === this.PENDIENTE) return 'Pendiente';
    if (status === this.APROBADO) return 'Aprobado';
    if (status === this.CANCELADO) return 'Cancelado';
    return 'Sin estatus';
  }

  private groupOrdersByClient(orders: Pedido[]): ClientOrdersGroup[] {
    const grouped = new Map<string, ClientOrdersGroup>();

    for (const order of orders) {
      const key = `${order.idCliente}-${order.nombreCliente}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          idCliente: order.idCliente,
          nombreCliente: order.nombreCliente,
          pedidos: [],
          totalPedidos: 0,
          totalBolsas: 0,
          totalPagar: 0,
          pendientes: 0,
          aprobados: 0,
          cancelados: 0
        });
      }

      const group = grouped.get(key)!;
      group.pedidos.push(order);
      group.totalPedidos += 1;
      group.totalBolsas += order.totalBolsas;
      group.totalPagar += order.totalPagar;

      if (order.estatusPedido === this.PENDIENTE) group.pendientes += 1;
      else if (order.estatusPedido === this.APROBADO) group.aprobados += 1;
      else group.cancelados += 1;
    }

    return Array.from(grouped.values())
      .map(group => ({
        ...group,
        pedidos: group.pedidos.sort((a, b) =>
          new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
        )
      }))
      .sort((a, b) => a.nombreCliente.localeCompare(b.nombreCliente));
  }
}
