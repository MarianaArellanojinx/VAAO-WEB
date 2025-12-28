import { Component, inject } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { Button } from "primeng/button";
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [InputTextModule, Button, HttpClientModule, FormsModule],
  providers: [ApiService],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {

  api: ApiService = inject(ApiService);
  bussinesName: string = '';
  clientName: string = '';
  clientLastName: string = '';
  street: string = '';
  colony: string = '';
  externalNumber: string = '';
  cp: string = '';
  phone: string = '';
  fridges: number = 0;
  downDate: null = null;

  saveClient(){
    const payload = {
      idCliente: 0,
      nombreNegocio: this.bussinesName,
      nombreCliente: this.clientName + ' ' + this.clientLastName,
      calle: this.street,
      colonia: this.colony,
      numeroExterior: this.externalNumber,
      cp: this.cp,
      telefono: this.phone.toString(),
      conservadores: this.fridges,
      fechaBaja: this.downDate
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Clientes/InsertClientes`, payload).subscribe({
      next: response => {
        if(response.data === true){
          console.log('Ok');
        }else{
          console.error('error');
        }
      }
    });
  }

}
