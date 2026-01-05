import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { User } from '../../../shared/interfaces/User';
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { CardComponent } from "../../../shared/components/card/card.component";
import { DialogService } from 'primeng/dynamicdialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { CardDashboardComponent } from "../../../shared/components/card-dashboard/card-dashboard.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    FormsModule,
    Button,
    HttpClientModule,
    CardDashboardComponent
],
  providers: [ApiService, DialogService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  ngOnInit(): void {
    this.getUsers()
  }
  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);

  users: User[] = [];
  cols: any[] = [
    { field: 'idUser', header: 'ID' },
    { field: 'userName', header: 'Nombre usuario' },
    { field: 'isActive', header: '¿Esta activo?' },
    { field: 'rolDescription', header: 'Rol' }
  ]
  open(){
    const modal = this.dialog.open(AddUserComponent, {
      header: 'Agregar nuevo usuario',
      baseZIndex: 9999,
      width: '80%'
    });
    modal.onClose.subscribe({
      next: response => {
        this.getUsers()
      }
    })
  }

  getUsers() {
    this.api.get<ResponseBackend<User[]>>(`${environment.urlBackend}Users/GetUsers`).subscribe({
      next: response => {
        this.users = response.data;
        this.users.map(u => {
          u.rolDescription = u.rol === 1 ? 'Administrador' : u.rol === 2 ? 'Encargado' : u.rol === 3 ? 'Repartidor' : 'Cliente'
        })
      }
    });
  }

}
