import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { ApiService } from '../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { User } from '../../shared/interfaces/User';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { Button } from "primeng/button";
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-add-dealer',
  standalone: true,
  imports: [InputTextModule, HttpClientModule, FormsModule, DropdownModule, Button],
  providers: [ApiService],
  templateUrl: './add-dealer.component.html',
  styleUrl: './add-dealer.component.scss'
})
export class AddDealerComponent implements OnInit {

  ngOnInit(): void {
    this.getAllUsers();
  }

  api: ApiService = inject(ApiService);
  ref: DynamicDialogRef = inject(DynamicDialogRef);
  alert: AlertService = inject(AlertService);

  loading: boolean = false;
  name: string = '';
  lastName: string = '';
  idUser: number | undefined = undefined;
  users: User[] = [];
  userName: string = '';

  getAllUsers(): void {
    this.api.get<ResponseBackend<User[]>>(`${environment.urlBackend}Users/GetUsers`).subscribe({
      next: response =>{
        this.users = response.data;
      },
      error: error => {

      }
    })
  }
  checkForms(): boolean {
    return (this.lastName.trim() !== '' && this.name.trim() !== '')
  }
  createUser() {
    this.loading = true;
    this.userName = this.name.substring(0,2) + this.lastName.substring(0,5);
    this.loading = true;
    const newUser: User = {
      idUser: 0,
      isActive: true,
      rol: 3,
      userName: this.name.substring(0,2) + this.lastName.substring(0,5),
      userPassword: '1234'
    }
    this.api.post<ResponseBackend<number>>(`${environment.urlBackend}Users/InsertUsers`, newUser).subscribe({
      next: response => {
        const id = response.data;
        this.saveDealer(id);
      }
    });
  }
  saveDealer(id: number): void {
    const payload = {
      idUser: id,
      nombreRepartidor: this.name,
      apellidoRepartidor: this.lastName,
      altaRepartidor: new Date().toISOString(),
      bajaRepartidor: null
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Repartidores/InsertRepartidores`, payload).subscribe({
      next: response => {
        this.loading = false;
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', `Se agregó un nuevo repartidor, su usuario es: ${this.userName}, contraseña: 1234.`, 'success')
          this.ref.close();
        }
      }
    })
  }

}
