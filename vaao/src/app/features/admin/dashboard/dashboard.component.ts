import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DateService } from '../../../core/services/date.service';
import { CardDashboardComponent } from '../../../shared/components/card-dashboard/card-dashboard.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DetailSellsComponent } from '../detail-sells/detail-sells.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    TableModule,
    HttpClientModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    CardDashboardComponent
  ],
  providers: [ApiService, DialogService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private readonly api: ApiService = inject(ApiService);
  private readonly date: DateService = inject(DateService);
  private readonly dialog: DialogService = inject(DialogService);

  dates: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)];
  ventas: any = undefined;
  statusChart: any = {};
  dataCards: any = {};
  idDataTableSelected: number = 1;
  dataTableCards: any[] | undefined = undefined;
  loadingCards: boolean = false;

  options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#000'
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#000' }
      },
      y: {
        stacked: true,
        ticks: { color: '#000' }
      }
    }
  };

  ngOnInit(): void {
    this.getDataDashboard();
  }

  filterDataTable(id: number): void {
    switch (id) {
      case 1:
        this.dataTableCards = this.dataCards?.tableToday;
        this.idDataTableSelected = 1;
        break;
      case 2:
        this.dataTableCards = this.dataCards?.tableWeek;
        this.idDataTableSelected = 2;
        break;
      case 3:
        this.dataTableCards = this.dataCards?.tableMonth;
        this.idDataTableSelected = 3;
        break;
    }
  }

  getDataCards(): void {
    this.loadingCards = true;
    const startDate = this.dates[0];
    const endDate = this.dates[1] ?? this.dates[0];
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Dashboard/GetDataCards?start=${start}&end=${end}`).subscribe({
      next: response => {
        this.dataCards = response.data;
        this.loadingCards = false;
      },
      error: () => {
        this.loadingCards = false;
      }
    });
  }

  getDataDashboard(): void {
    this.getDataCards();
    this.getData();
    this.getStatusChart();
  }

  getStatusChart(): void {
    const end = this.dates[1].toISOString();
    const start = this.dates[0].toISOString();
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Dashboard/GetEstatusPedidos?start=${start}&end=${end}`).subscribe({
      next: response => {
        this.statusChart = response.data;
      }
    });
  }

  getData(): void {
    const end = this.dates[1].toISOString();
    const start = this.dates[0].toISOString();
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Dashboard/GetHistoricoVentas?start=${start}&end=${end}`).subscribe({
      next: response => {
        this.ventas = response.data;
      }
    });
  }

  openModalDetails(data: any): void {
    this.dialog.open(DetailSellsComponent, {
      header: 'Detalle de ventas',
      baseZIndex: 9999,
      data: { id: this.idDataTableSelected, data },
      width: 'auto'
    });
  }
}
