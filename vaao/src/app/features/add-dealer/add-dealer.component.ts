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

  getAllUsers(): void {
    this.api.get<ResponseBackend<User[]>>(`${environment.urlBackend}Users/GetUsers`).subscribe({
      next: response =>{
        this.users = response.data;
      },
      error: error => {

      }
    })
  }

  saveDealer(): void {
    this.loading = true;
    const payload = {
      idUser: this.idUser,
      nombreRepartidor: this.name,
      apellidoRepartidor: this.lastName,
      altaRepartidor: new Date().toISOString(),
      bajaRepartidor: null
    }
    this.api.post<ResponseBackend<boolean>>(``, payload).subscribe({
      next: response => {
        this.loading = false;
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', 'Se agregó un nuevo repartidor.', 'success')
          this.ref.close();
        }
      }
    })
  }

}
