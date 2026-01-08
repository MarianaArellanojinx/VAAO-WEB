import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ImageService } from '../../core/services/image.service';
import { ApiService } from '../../infrastructure/api.service';
import { AlertService } from '../../core/services/alert.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { ImageModule } from "primeng/image";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ImageConfig } from '../../shared/interfaces/ImageConfig';

@Component({
  selector: 'app-arrivals-delivery',
  standalone: true,
  imports: [
    FileUploadModule,
    HttpClientModule,
    ImageModule,
    ProgressSpinnerModule
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
  loading: boolean = false;
  optionsImage: ImageConfig = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.6,
    mimeType: 'image/jpeg',
    removePrefix: false
  }

  saveImage() {
    this.loading = true;
    this.entrega.imagenConservadorLlegada = this.base64;
    this.entrega.horaLlegada = new Date().toISOString();
    this.entrega.estatusReparto = 2;
    this.api.patch(`${environment.urlBackend}Entregas/UpdateEntrega/${this.entrega.idEntrega}/false`, this.entrega).subscribe({
      next: response => {
        this.loading = false;
        this.alert.dinamycMessage('Hecho!!', 'Se ha cargado la evidencia', 'success')
        this.ref.close();
      }
    })
  }
  onFileSelectedAndroid(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('No se seleccionó ningún archivo');
      return;
    }
    this.file = input.files[0];

    this.image.fileToBase64(this.file, this.optionsImage).then(result => {
      this.base64 = result;
    });
  }
}
