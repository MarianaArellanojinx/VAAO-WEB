import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../infrastructure/api.service';
import { DateService } from '../../core/services/date.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { Pedido } from '../../shared/interfaces/Pedido';
import { environment } from '../../../environments/environment';
import { CardDashboardComponent } from '../../shared/components/card-dashboard/card-dashboard.component';
import { catchError, forkJoin, map, of } from 'rxjs';

interface ClientDto {
  idCliente: number;
  nombreCliente?: string;
  nombreNegocio?: string;
}

interface ClientOrdersGroup {
  key: string;
  idCliente: number;
  displayName: string;
  nombreCliente: string;
  nombreNegocio: string;
  pedidos: Pedido[];
  totalPedidos: number;
  totalBolsas: number;
  totalPagar: number;
  pendientes: number;
  aprobados: number;
  cancelados: number;
}

interface FilterOption {
  label: string;
  value: string | number | null;
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
    DropdownModule,
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
  readonly FILTER_ALL = 'all';
  readonly FILTER_WITH_PURCHASES = 'withPurchases';
  readonly FILTER_WITHOUT_PURCHASES = 'withoutPurchases';

  dates: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)];
  loading: boolean = false;
  groups: ClientOrdersGroup[] = [];
  selectedClientId: number | null = null;
  selectedPurchaseFilter: string = this.FILTER_ALL;

  purchaseFilterOptions: FilterOption[] = [
    { label: 'Todos', value: this.FILTER_ALL },
    { label: 'Con compras', value: this.FILTER_WITH_PURCHASES },
    { label: 'Sin compras', value: this.FILTER_WITHOUT_PURCHASES }
  ];

  get startDateForCard(): Date {
    return this.dates[0] ?? new Date();
  }

  get endDateForCard(): Date {
    return this.dates[1] ?? this.startDateForCard;
  }

  get clientOptions(): FilterOption[] {
    return [
      { label: 'Todos los clientes', value: null },
      ...this.groups.map(group => ({
        label: `${group.displayName} (ID ${group.idCliente})`,
        value: group.idCliente
      }))
    ];
  }

  ngOnInit(): void {
    this.getOrdersByClient();
  }

  get filteredGroups(): ClientOrdersGroup[] {
    return this.groups.filter(group => {
      const byClient = this.selectedClientId == null || group.idCliente === this.selectedClientId;
      const byPurchaseState =
        this.selectedPurchaseFilter === this.FILTER_ALL ||
        (this.selectedPurchaseFilter === this.FILTER_WITH_PURCHASES && group.totalPedidos > 0) ||
        (this.selectedPurchaseFilter === this.FILTER_WITHOUT_PURCHASES && group.totalPedidos === 0);

      return byClient && byPurchaseState;
    });
  }

  getOrdersByClient(): void {
    const startDate = this.dates[0] ?? new Date();
    const endDate = this.dates[1] ?? startDate;
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    this.loading = true;

    const ordersRequest$ = this.api
      .get<ResponseBackend<Pedido[]>>(`${environment.urlBackend}Pedidos/GetPedidosFiltrados?start=${start}&end=${end}`)
      .pipe(
        map(response => (response.data ?? []).map(order => ({
          ...order,
          estatusTexto: this.getStatusText(order.estatusPedido)
        }))),
        catchError(() => of([] as Pedido[]))
      );

    const clientsRequest$ = this.api
      .get<ResponseBackend<ClientDto[]>>(`${environment.urlBackend}Clientes/GetClientes`)
      .pipe(
        map(response => response.data ?? []),
        catchError(() => of([] as ClientDto[]))
      );

    forkJoin([ordersRequest$, clientsRequest$]).subscribe({
      next: ([orders, clients]) => {
        this.groups = this.groupOrdersByClient(clients, orders);
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

  private groupOrdersByClient(clients: ClientDto[], orders: Pedido[]): ClientOrdersGroup[] {
    const grouped = new Map<number, ClientOrdersGroup>();

    for (const order of orders) {
      if (!grouped.has(order.idCliente)) {
        grouped.set(order.idCliente, {
          key: `${order.idCliente}`,
          idCliente: order.idCliente,
          displayName: order.nombreCliente,
          nombreCliente: order.nombreCliente,
          nombreNegocio: order.nombreCliente,
          pedidos: [],
          totalPedidos: 0,
          totalBolsas: 0,
          totalPagar: 0,
          pendientes: 0,
          aprobados: 0,
          cancelados: 0
        });
      }

      const group = grouped.get(order.idCliente)!;
      group.pedidos.push(order);
      group.totalPedidos += 1;
      group.totalBolsas += order.totalBolsas;
      group.totalPagar += order.totalPagar;

      if (order.estatusPedido === this.PENDIENTE) group.pendientes += 1;
      else if (order.estatusPedido === this.APROBADO) group.aprobados += 1;
      else group.cancelados += 1;
    }

    for (const client of clients) {
      if (grouped.has(client.idCliente)) {
        const existing = grouped.get(client.idCliente)!;
        existing.nombreCliente = client.nombreCliente ?? existing.nombreCliente;
        existing.nombreNegocio = client.nombreNegocio ?? existing.nombreNegocio;
        existing.displayName = client.nombreNegocio || client.nombreCliente || existing.displayName;
        continue;
      }

      grouped.set(client.idCliente, {
        key: `${client.idCliente}`,
        idCliente: client.idCliente,
        displayName: client.nombreNegocio || client.nombreCliente || `Cliente ${client.idCliente}`,
        nombreCliente: client.nombreCliente ?? 'Sin nombre de cliente',
        nombreNegocio: client.nombreNegocio ?? 'Sin nombre de negocio',
        pedidos: [],
        totalPedidos: 0,
        totalBolsas: 0,
        totalPagar: 0,
        pendientes: 0,
        aprobados: 0,
        cancelados: 0
      });
    }

    return Array.from(grouped.values())
      .map(group => ({
        ...group,
        pedidos: group.pedidos.sort((a, b) =>
          new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
        )
      }))
      .sort((a, b) => {
        const aHasPurchases = a.totalPedidos > 0;
        const bHasPurchases = b.totalPedidos > 0;

        // 1) Siempre primero clientes con compras, al final sin compras.
        if (aHasPurchases && !bHasPurchases) return -1;
        if (!aHasPurchases && bHasPurchases) return 1;

        // 2) Entre clientes con compras: mayor a menor por monto total.
        if (aHasPurchases && bHasPurchases) {
          if (b.totalPagar !== a.totalPagar) return b.totalPagar - a.totalPagar;
          if (b.totalPedidos !== a.totalPedidos) return b.totalPedidos - a.totalPedidos;
          if (b.totalBolsas !== a.totalBolsas) return b.totalBolsas - a.totalBolsas;
        }

        // 3) Empate o ambos sin compras: orden alfabético estable.
        return a.displayName.localeCompare(b.displayName);
      });
  }
}
