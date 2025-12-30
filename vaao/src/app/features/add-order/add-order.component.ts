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

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [InputTextModule, InputTextareaModule, Button, FormsModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss'
})
export class AddOrderComponent implements OnInit {

  ngOnInit(): void {
    
  }

  private api: ApiService = inject(ApiService);
  private auth: AuthService = inject(AuthService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);

  bolsas: number = 0;
  comments: string = '';
  loading: boolean = false;
  idCliente: number = 0;

  getClients() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        this.idCliente = response.data.filter((c: any) => c.idUser === this.auth.getUser().idUser)[0].idCliente
      }
    })
  }

  createOrder(){
    this.loading = true;
    const payload = {
      idPedido: 0,
      idCliente: this.idCliente,
      fechaPedido: new Date().toISOString(),
      fechaProgramada: new Date().toISOString(),
      totalBolsas: this.bolsas,
      precioUnitario: 25,
      totalPagar: this.bolsas*25,
      estatusPedido: 1,
      observaciones: this.comments,
      idRepartidor: 2
    }
    this.api.post<ResponseBackend<boolean>>(`${environment.urlBackend}Pedidos/InsertPedidos`, payload).subscribe({
      next: response =>{
        this.loading = false;
        if(response.data === true) this.ref.close()
      }
    });
  }

}
