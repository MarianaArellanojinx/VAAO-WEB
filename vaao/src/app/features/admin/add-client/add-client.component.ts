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
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [InputTextModule, Button, HttpClientModule, FormsModule, DropdownModule, CheckboxModule],
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

  isPlant: boolean = false;
  icePrice: number = 0
  loading: boolean = false;
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
  createUser() {
    this.loading = true;
    const newUser: User = {
      idUser: 0,
      isActive: true,
      rol: 4,
      userName: this.clientName.substring(0,2) + this.clientLastName.substring(0,5),
      userPassword: '1234'
    }
    this.api.post<ResponseBackend<number>>(`${environment.urlBackend}Users/InsertUsers`, newUser).subscribe({
      next: response => {
        const id = response.data;
        this.saveClient(id);
      }
    });
  }
  saveClient(idUser: number){
    const payload = {
      esPlanta: this.isPlant,
      precioHielo: this.icePrice,
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
      idUser: idUser
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Clientes/InsertClientes`, payload)
    .subscribe({
      next: response => {
        this.loading = false;
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', `Se ha registrado un nuevo cliente (Usuario: ${this.clientName.substring(0,2) + this.clientLastName.substring(0,5)}, contraseña: 1234)`, 'success');
          this.ref.close();
        }else{
          this.alert.dinamycMessage('Ups...', 'Ocurrio un error inesperado, intente de nuevo más tarde', 'error');
          this.ref.close();
        }
      }
    });
  }

}
