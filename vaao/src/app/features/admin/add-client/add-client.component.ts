import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { Button } from "primeng/button";
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { User } from '../../../shared/interfaces/User';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [InputTextModule, Button, HttpClientModule, FormsModule, DropdownModule],
  providers: [ApiService],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit {

  ngOnInit(): void {
    this.getUsers();
  }

  private api: ApiService = inject(ApiService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private alert: AlertService = inject(AlertService);

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
  user: number = 0;

  users: User[] = [];

  getUsers() {
    this.api.get<ResponseBackend<User[]>>(`${environment.urlBackend}Users/GetUsers`).subscribe({
      next: response => {
        this.users = response.data.filter(x => x.rol === 4);
      }
    });
  }
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
      fechaBaja: this.downDate,
      idUser: this.user
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Clientes/InsertClientes`, payload)
    .subscribe({
      next: response => {
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', 'Se ha registrado un nuevo cliente.', 'success');
          this.ref.close();
        }else{
          this.alert.dinamycMessage('Ups...', 'Ocurrio un error inesperado, intente de nuevo más tarde', 'error');
          this.ref.close();
        }
      }
    });
  }

}
