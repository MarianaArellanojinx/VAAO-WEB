import { Component, inject, OnInit } from '@angular/core';
import { ImageModule } from "primeng/image";
import { ImageService } from '../../core/services/image.service';
import { ImageConfig } from '../../shared/interfaces/ImageConfig';
import { DropdownModule } from "primeng/dropdown";
import { ApiService } from '../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { Button } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-add-visit',
  standalone: true,
  imports: [ImageModule, DropdownModule, HttpClientModule, Button, FormsModule],
  providers: [ApiService],
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.scss'
})
export class AddVisitComponent implements OnInit {

  ngOnInit(): void {
    this.getClients()
  }

  private readonly api: ApiService = inject(ApiService);
  private readonly auth: AuthService = inject(AuthService);
  private readonly alert: AlertService = inject(AlertService);
  private readonly image: ImageService = inject(ImageService);
  private readonly ref: DynamicDialogRef = inject(DynamicDialogRef)
  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig)

  clients: any[] = [];
  
  selectedClient: number = 0;

  base64: string = '';
  file!: File;
  optionsImage: ImageConfig = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.4,
    mimeType: 'image/jpeg',
    removePrefix: false
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

  disabled(): boolean {
    return (this.selectedClient === 0 || this.base64 === '')
  }

  getClients(){
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        this.clients = response.data;
        this.selectedClient = this.config.data.idCliente ?? 0
      }
    });
  }
  loading: boolean = false;
  saveVisit(){
    this.loading = true;
    const payload = {
      idVisita: 0,
      idCliente: this.selectedClient,
      fechaVisita: new Date().toISOString(),
      idUsuario: this.auth.getUser()?.idUser,
      evidencia: this.base64
    };
    this.api.post<ResponseBackend<any>>(`${environment.urlBackend}Visitas/InsertVisita`, payload).subscribe({
      next: response => {
        this.loading = false;
        this.alert.dinamycMessage('Hecho!!', 'Se ha registrado su visita.', 'success');
        this.ref.close()
      }
    })
  }

}
