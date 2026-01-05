import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ImageService } from '../../core/services/image.service';
import { ApiService } from '../../infrastructure/api.service';
import { Pedido } from '../../shared/interfaces/Pedido';
import { AlertService } from '../../core/services/alert.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-arrivals-delivery',
  standalone: true,
  imports: [
    FileUploadModule,
    HttpClientModule
  ],
  providers: [],
  templateUrl: './arrivals-delivery.component.html',
  styleUrl: './arrivals-delivery.component.scss'
})
export class ArrivalsDeliveryComponent implements OnInit {

  ngOnInit(): void {
    this.entrega = this.config.data;
  }

  private image: ImageService = inject(ImageService);
  private api: ApiService = inject(ApiService);
  private alert: AlertService = inject(AlertService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private config: DynamicDialogConfig = inject(DynamicDialogConfig);

  isAndroid = Capacitor.getPlatform() === 'android';
  file: File | undefined = undefined;
  base64: string = '';
  entrega: any = {};

  saveImage() {
    this.entrega.imagenConservadorLlegada = this.base64;
    this.entrega.horaLlegada = new Date().toISOString();
    this.entrega.estatusReparto = 2;
    this.api.patch(`${environment.urlBackend}Entregas/UpdateEntrega/${this.entrega.idEntrega}`, this.entrega).subscribe({
      next: response => {
        this.alert.dinamycMessage('Hecho!!', 'Se ha cargado la evidencia', 'success')
        this.ref.close();
      }
    })
  }

  onFileSelected(event: any) {
    console.log(event)
    this.file = event.currentFiles[0]
    this.image.fileToBase64(this.file ?? new Blob()).then(result => {
      this.base64 = result
      console.log(result)
    });
  }
  onFileSelectedAndroid(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('No se seleccionó ningún archivo');
      return;
    }
  }
  
  test(event: any){
    this.file = event.currentFiles[0]
    console.log(this.file)
    this.image.fileToBase64(this.file ?? new Blob()).then(result => {
      this.base64 = result
    });
  }



}
