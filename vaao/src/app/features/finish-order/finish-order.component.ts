import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FileUploadModule } from "primeng/fileupload";
import { ImageService } from '../../core/services/image.service';
import { DropdownModule } from "primeng/dropdown";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { MetodoPago } from '../../shared/interfaces/MetodoPago';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { Pedido } from '../../shared/interfaces/Pedido';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [FileUploadModule, DropdownModule, FormsModule],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.scss'
})
export class FinishOrderComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
    this.Entrega = this.config.data.Entrega;
    this.Pedido = this.config.data.Pedido;
  }

  ngAfterViewInit(): void {
    this.isAndroid = Capacitor.getPlatform() === 'android';
    console.log(this.isAndroid);
  }
  private readonly api: ApiService = inject(ApiService);
  private readonly image: ImageService = inject(ImageService);
  private readonly alert: AlertService = inject(AlertService);
  private readonly ref: DynamicDialogRef = inject(DynamicDialogRef);
  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);

  isAndroid: boolean = false;
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
  onFileSelectedAndroid(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    console.warn('No se seleccionó ningún archivo');
    return;
  }

  this.file = input.files[0];

  this.image.fileToBase64(this.file).then(result => {
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
        this.ref.close(true);
        this.alert.dinamycMessage('Hecho!!', 'Se ha terminado y confirmado la venta', 'success');
      }
    })
  }
}
