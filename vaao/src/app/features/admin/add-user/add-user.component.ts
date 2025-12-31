import { Component, inject } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { ApiService } from '../../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResponseBackend } from '../../../shared/interfaces/ResponseBackend';
import { environment } from '../../../../environments/environment';
import { DropdownModule } from "primeng/dropdown";
import { Button } from "primeng/button";
import { AlertService } from '../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [InputTextModule, HttpClientModule, DropdownModule, Button, FormsModule],
  providers: [ApiService],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  private api: ApiService = inject(ApiService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef)
  private alert: AlertService = inject(AlertService);

  username: string = '';
  password: string = '';
  role: number = 0;

  roleOptions: any[] = [
    {
      value: 1,
      label: 'Administrador'
    },
    {
      value: 2,
      label: 'Encargado'
    },
    {
      value: 3,
      label: 'Repartidor'
    },
    {
      value: 4,
      label: 'Cliente'
    }
  ]

  save() {
    const payload = {
      userName: this.username,
      userPassword: this.password,
      isActive: true,
      rol: this.role
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Users/InsertUsers`, payload).subscribe({
      next: response => {
        if(response.data === true){
          this.alert.dinamycMessage('Hecho!!', 'Se ha creado el usuario', 'success')
          this.ref.close()
        }
      }
    })
  }

}
