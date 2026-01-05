import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { ChartModule } from 'primeng/chart'
import { TableModule } from 'primeng/table'
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from '@angular/forms';
import { DateService } from '../../../core/services/date.service';
import { ReportDownloadCardComponent } from "../../../shared/components/report-download-card/report-download-card.component";
import { CardDashboardComponent } from "../../../shared/components/card-dashboard/card-dashboard.component";
import { AlertService } from '../../../core/services/alert.service';
import { ReportVentaPerdida } from '../../../shared/interfaces/ReportVentaPerdida';
import { ExportService } from '../../../core/services/export.service';
interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ChartModule,
    TableModule,
    HttpClientModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    ReportDownloadCardComponent,
    CardDashboardComponent
],
  providers: [ApiService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    this.getDataDashboard();
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  private api: ApiService = inject(ApiService);
  private date: DateService = inject(DateService);
  private alert: AlertService = inject(AlertService);
  private export: ExportService = inject(ExportService);

  dates: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)];

  snowflake: any = faSnowflake;
  download: any = faDownload;

  private readonly META_VENTAS: number = 30;
  downloadInProgress: boolean = false;
  ventas: any = undefined;
  statusChart: any = {};
  exportColumns!: ExportColumn[];
  cols: {field: string, header: string, customExportHeader?: string}[] = [
    {
      field: 'cliente',
      header: 'Cliente'
    },
    {
      field: 'bolsas',
      header: 'Bolsas',
      customExportHeader: 'Bolsas compradas'
    },
    {
      field: 'total',
      header: 'Total',
      customExportHeader: 'Total pagado'
    },
    {
      field: 'pedido',
      header: 'Pedido',
      customExportHeader: 'Fecha pedido'
    }
  ]
  options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#000'
        }
      },
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

  getDataDashboard(){
    this.getData()
    this.getStatusChart();
  }
  getStatusChart() {
    const end = this.dates[1].toISOString();
    const start = this.dates[0].toISOString();
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Dashboard/GetEstatusPedidos?start=${start}&end=${end}`).subscribe({
      next: response => {
        this.statusChart = response.data;
      }
    });
  }
  getData() {
    const end = this.dates[1].toISOString();
    const start = this.dates[0].toISOString();
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Dashboard/GetHistoricoVentas?start=${start}&end=${end}`).subscribe({
      next: response => {
        this.ventas = response.data;
      }
    });
  }
  downloadReport(){
    this.downloadInProgress = true;
    this.api.get<ResponseBackend<ReportVentaPerdida[]>>(`${environment.urlBackend}Report/GetVentasPerdidas`)
    .subscribe({
      next: response => {
        this.downloadInProgress = false;
        let data: ReportVentaPerdida[] = response.data;
        data = data.map(item => ({
          ...item,
          faltanteCompra: this.META_VENTAS - item.totalbolsas
        }));
        this.downloadInProgress = false;
        this.export.exportToExcel(data, 'Reporte_Ventas_Perdidas', 'Ventas_Perdidas');
      }
    });
  }

}
