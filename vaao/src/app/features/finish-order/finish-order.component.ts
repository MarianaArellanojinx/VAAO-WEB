import { Component, inject } from '@angular/core';
import { FileUploadModule } from "primeng/fileupload";
import { ImageService } from '../../core/services/image.service';
import { DropdownModule } from "primeng/dropdown";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { MetodoPago } from '../../shared/interfaces/MetodoPago';

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [FileUploadModule, DropdownModule],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.scss'
})
export class FinishOrderComponent {

  private readonly api: ApiService = inject(ApiService);
  private readonly image: ImageService = inject(ImageService);

  isAndroid = /Android/i.test(navigator.userAgent);
  file!: File;
  base64: string = '';

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

  getPayments() {
    this.api.get<ResponseBackend<MetodoPago>>(``);
  }

  onFileSelected(event: any) {
    this.file = event.currentFiles[0];
    this.image.fileToBase64(this.file ?? new Blob()).then(result => {
      this.base64 = result;
    });
  }

}
