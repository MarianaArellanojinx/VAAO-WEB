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
import { User } from '../../shared/interfaces/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [CommonModule, InputTextModule, InputTextareaModule, Button, FormsModule, CalendarModule, DropdownModule, SpeedDialModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss'
})
export class AddOrderComponent implements OnInit {

  ngOnInit(): void {
    this.user = this.auth.getUser();
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
  unitPrice: number = 0;
  user: User | null = null;

  isValid(): boolean {
    return (this.idCliente > 0 && this.bolsas > 0 && this.comments.trim() !== '' && this.unitPrice > 0)
  }

  get totalEstimated(): number {
    return this.bolsas > 0 ? this.bolsas * this.unitPrice : 0;
  }

  private getClientUnitPrice(client: any): number {
    const rawPrice =
      client?.precioHielo ??
      client?.precioUnitario ??
      client?.precioBolsa ??
      client?.precio;

    const price = Number(rawPrice);
    return Number.isFinite(price) && price > 0 ? price : 0;
  }

  onClientChange(idClient: number): void {
    this.idCliente = idClient;
    this.syncSelectedClientPrice();
  }

  private syncSelectedClientPrice(): void {
    const selectedClient = this.clientes.find((c: any) => c.idCliente === this.idCliente);
    this.unitPrice = selectedClient ? this.getClientUnitPrice(selectedClient) : 0;
  }

  getClients() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        if(this.user?.rol == 1){
          this.clientes = response.data.filter((x: any) => x.esPlanta === true);
        }else{
          this.clientes = response.data.filter((c: any) => c.idUser === this.auth.getUser()?.idUser);
        }
        if(this.clientes.length > 0){
          this.idCliente = this.clientes[0].idCliente;
          this.syncSelectedClientPrice();
        } else {
          this.unitPrice = 0;
        }
      }
    })
  }
  createOrder(){
    if(this.unitPrice <= 0){
      this.alert.dinamycMessage('Precio faltante', 'El cliente seleccionado no tiene precio por bolsa configurado.', 'error');
      return;
    }
    this.loading = true;
    const payload = {
      idPedido: 0,
      idCliente: this.idCliente,
      fechaPedido: new Date().toISOString(),
      fechaProgramada: this.scheduledDate.toISOString(),
      totalBolsas: this.bolsas,
      precioUnitario: this.unitPrice,
      totalPagar: this.bolsas * this.unitPrice,
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
