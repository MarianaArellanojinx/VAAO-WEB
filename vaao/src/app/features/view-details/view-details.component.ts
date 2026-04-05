import { Component, inject, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../shared/interfaces/Pedido';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [ImageModule, HttpClientModule, CommonModule, ProgressSpinnerModule],
  providers: [ApiService],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent implements OnInit {

  ngOnInit(): void {
    const payload = this.config.data;
    if (typeof payload === 'number') {
      this.id = payload;
    } else {
      this.id = payload?.idPedido ?? 0;
      this.pedido = payload?.pedido ?? null;
    }

    if (this.id > 0) {
      this.getDetail();
    }
  }
  private readonly api: ApiService = inject(ApiService);
  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);

  id: number = 0;
  pedido: Pedido | null = null;
  data: any = {};
  loading: boolean = false;

  getDetail(): void {
    this.loading = true;
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Entregas?pedidoId=${this.id}`).subscribe({
      next: response => {
        this.data = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    }); 
  }

  getDeliveryStatusText(): string {
    const status = this.data?.estatusReparto;
    if (status === 1) return 'En camino';
    if (status === 2) return 'Llegada registrada';
    if (status === 3) return 'Entregado';
    return 'Sin estatus';
  }

  hasImage(value: string | null | undefined): boolean {
    return typeof value === 'string' && value.trim() !== '';
  }

}
