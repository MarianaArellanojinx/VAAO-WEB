import { DatePipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DateService } from '../../../core/services/date.service';
import { ExportService } from '../../../core/services/export.service';
import { ApiService } from '../../../infrastructure/api.service';
import { CardDashboardComponent } from '../../../shared/components/card-dashboard/card-dashboard.component';
import { ReportDownloadCardComponent } from '../../../shared/components/report-download-card/report-download-card.component';
import { ReportVentaPerdida, ReportVentaPerdidaResponse, ReportVentaPerdidaResumen } from '../../../shared/interfaces/ReportVentaPerdida';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CalendarModule,
    Button,
    TableModule,
    TagModule,
    CardDashboardComponent,
    ReportDownloadCardComponent
  ],
  providers: [ApiService, DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  private readonly api: ApiService = inject(ApiService);
  private readonly date: DateService = inject(DateService);
  private readonly exportService: ExportService = inject(ExportService);
  private readonly datePipe: DatePipe = inject(DatePipe);

  readonly META_BOLSAS_SEMANAL: number = 30;

  datesReports: Date[] = [this.date.getMonday(new Date()), this.date.addDays(this.date.getMonday(new Date()), 6)];
  loading: boolean = false;
  downloadVentaPerdida: boolean = false;
  downloadRechazado: boolean = false;

  reportData: ReportVentaPerdidaResponse = {
    resumen: this.getEmptyResumen(),
    detalle: []
  };

  ngOnInit(): void {
    this.getVentasPerdidasResumen();
  }

  get summary(): ReportVentaPerdidaResumen {
    return this.reportData.resumen;
  }

  get detalleConFaltante(): ReportVentaPerdida[] {
    return this.reportData.detalle.filter(item => item.bolsasPerdidas > 0);
  }

  getVentasPerdidasResumen(): void {
    const range = this.getRange();
    this.loading = true;

    this.api.get<ResponseBackend<ReportVentaPerdidaResponse>>(
      `${environment.urlBackend}Report/GetVentasPerdidasResumen?start=${range.start}&end=${range.end}&metaBolsas=${this.META_BOLSAS_SEMANAL}`
    ).subscribe({
      next: response => {
        this.reportData = response.data ?? {
          resumen: this.getEmptyResumen(),
          detalle: []
        };
        this.loading = false;
      },
      error: () => {
        this.reportData = {
          resumen: this.getEmptyResumen(),
          detalle: []
        };
        this.loading = false;
      }
    });
  }

  downloadReportVentaPerdida(): void {
    const range = this.getRange();
    this.downloadVentaPerdida = true;

    this.api.get<ResponseBackend<ReportVentaPerdida[]>>(
      `${environment.urlBackend}Report/GetVentasPerdidas?start=${range.start}&end=${range.end}&metaBolsas=${this.META_BOLSAS_SEMANAL}`
    ).subscribe({
      next: async response => {
        const data = (response.data ?? []).map(item => ({
          negocio: item.nombreNegocio,
          cliente: item.nombreCliente,
          anio: item.anioSemana,
          semana: item.numeroSemana,
          inicioSemana: this.formatDate(item.inicioSemana),
          finSemana: this.formatDate(item.finSemana),
          bolsasObjetivo: item.bolsasObjetivo,
          bolsasCompradas: item.bolsasCompradas,
          bolsasPerdidas: item.bolsasPerdidas,
          totalPagado: item.totalPagado,
          cumplioObjetivo: item.cumplioObjetivo ? 'Si' : 'No'
        }));

        try {
          await this.exportService.exportToExcel(data, 'Reporte_Venta_Perdida', 'Venta_Perdida');
        } finally {
          this.downloadVentaPerdida = false;
        }
      },
      error: () => {
        this.downloadVentaPerdida = false;
      }
    });
  }

  downloadReportPedidoRechazado(): void {
    const range = this.getRange();
    this.downloadRechazado = true;

    this.api.get<ResponseBackend<any[]>>(
      `${environment.urlBackend}Report/GetPedidosRechazados?startDate=${range.start}&endDate=${range.end}`
    ).subscribe({
      next: async response => {
        const data = (response.data ?? []).map(item => ({
          cliente: item.cliente,
          negocio: item.negocio,
          semana: item.numsemana,
          bolsasSolicitadas: item.totalBolsas,
          dineroPerdido: item.totalPagar
        }));

        try {
          await this.exportService.exportToExcel(data, 'Reporte_Venta_Cancelada', 'Venta_Cancelada');
        } finally {
          this.downloadRechazado = false;
        }
      },
      error: () => {
        this.downloadRechazado = false;
      }
    });
  }

  getCumplimientoSeverity(item: ReportVentaPerdida): 'success' | 'warning' {
    return item.cumplioObjetivo ? 'success' : 'warning';
  }

  private getRange(): { start: string; end: string } {
    const startDate = this.datesReports[0] ?? this.date.getMonday(new Date());
    const endDate = this.datesReports[1] ?? startDate;
    this.datesReports = [startDate, endDate];

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };
  }

  private formatDate(dateValue: string): string {
    return this.datePipe.transform(dateValue, 'dd/MM/yyyy') ?? '';
  }

  private getEmptyResumen(): ReportVentaPerdidaResumen {
    return {
      metaBolsasPorSemana: this.META_BOLSAS_SEMANAL,
      totalNegocios: 0,
      totalSemanas: 0,
      totalRegistros: 0,
      totalBolsasObjetivo: 0,
      totalBolsasCompradas: 0,
      totalBolsasPerdidas: 0,
      negociosConFaltante: 0,
      negociosSinCompras: 0,
      porcentajeCumplimiento: 0
    };
  }
}
