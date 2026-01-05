import { Component, inject, OnInit } from '@angular/core';
import { FileUploadModule } from "primeng/fileupload";
import { ImageService } from '../../core/services/image.service';
import { DropdownModule } from "primeng/dropdown";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { MetodoPago } from '../../shared/interfaces/MetodoPago';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { Pedido } from '../../shared/interfaces/Pedido';

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [FileUploadModule, DropdownModule, FormsModule],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.scss'
})
export class FinishOrderComponent implements OnInit {

  ngOnInit(): void {
    this.Entrega = this.config.data.Entrega;
    this.Pedido = this.config.data.Pedido;
  }

  private readonly api: ApiService = inject(ApiService);
  private readonly image: ImageService = inject(ImageService);
  private readonly alert: AlertService = inject(AlertService);
  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);

  isAndroid = /Android/i.test(navigator.userAgent);
  file!: File;
  base64: string = '';
  Pedido!: Pedido;
  Entrega!: any;

  metodos: MetodoPago[] = [
    {
      idMetodoPago: 1,
      descripcion: 'Tarjeta'
    },
    {
      idMetodoPago: 2,
      descripcion: 'Efectivo'
    },
    {
      idMetodoPago: 3,
      descripcion: 'Transferencia'
    }
  ];

  metodo: number = 0;

  getPayments() {
    this.api.get<ResponseBackend<MetodoPago>>(``);
  }

  onFileSelected(event: any) {
    this.file = event.currentFiles[0];
    this.image.fileToBase64(this.file ?? new Blob()).then(result => {
      this.base64 = result;
    });
  }

  finishDelivery() {
    this.Entrega.estatusReparto = 3;
    this.Entrega.imagenConservadorSalida = this.base64;
    this.api.patch<ResponseBackend<any>>(`${environment.urlBackend}Entregas/UpdateEntrega/${this.Entrega.idEntrega}`, this.Entrega)
    .subscribe({
      next: response => {
        this.createSell();
      }, 
      error: error => this.alert.dinamycMessage('Ups...', 'Ocurrio un error, intente de nuevo más tarde', 'error')
    });
  }
  createSell() {
    const payload = {
      idPedido: this.Pedido.idPedido,
      idMetodoPago: this.metodo,
      fechaRegistro: new Date().toISOString()
    }
    this.api.post<ResponseBackend<any>>(`${environment.urlBackend}Ventas/InsertVenta`, payload).subscribe({
      next: response => {
        this.alert.dinamycMessage('Hecho!!', 'Se ha terminado y confirmado la venta', 'success');
      }
    })
  }
}
