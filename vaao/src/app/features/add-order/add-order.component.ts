import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea'
import { Button } from "primeng/button";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { SpeedDialModule } from 'primeng/speeddial';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [InputTextModule, InputTextareaModule, Button, FormsModule, CalendarModule, DropdownModule, SpeedDialModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss'
})
export class AddOrderComponent implements OnInit {

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate());
    this.minDate = yesterday;
    this.getClients();
  }

  private api: ApiService = inject(ApiService);
  private auth: AuthService = inject(AuthService);
  private alert: AlertService = inject(AlertService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);

  minDate: Date | undefined;
  bolsas: number = 0;
  comments: string = '';
  loading: boolean = false;
  idCliente: number = 0;
  clientes: any[] = [];
  scheduledDate: Date = new Date();

  isValid(): boolean {
    return (this.idCliente > 0 && this.bolsas > 0 && this.comments.trim() !== '')
  }

  getClients() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        this.clientes = response.data.filter((c: any) => c.idUser === this.auth.getUser()?.idUser);
        if(this.clientes.length > 0){
          this.idCliente = this.clientes[0].idCliente;
        }
      }
    })
  }
  createOrder(){
    this.loading = true;
    const payload = {
      idPedido: 0,
      idCliente: this.idCliente,
      fechaPedido: new Date().toISOString(),
      fechaProgramada: this.scheduledDate.toISOString(),
      totalBolsas: this.bolsas,
      precioUnitario: 25,
      totalPagar: this.bolsas*25,
      estatusPedido: 1,
      observaciones: this.comments,
      idRepartidor: null
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Pedidos/InsertPedidos`, payload).subscribe({
      next: response =>{
        this.loading = false;
        this.alert.dinamycMessage('Hecho!!', 'Se ha creado su orden, espere confirmación', 'success')
        if(response.data === true) this.ref.close()
      }
    });
  }

}
