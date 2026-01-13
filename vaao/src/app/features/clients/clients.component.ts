import { Component, inject, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { CardComponent } from "../../shared/components/card/card.component";
import { ApiService } from '../../infrastructure/api.service';
import { environment } from '../../../environments/environment';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { HttpClientModule } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { AddClientComponent } from '../admin/add-client/add-client.component';
import { CardDashboardComponent } from "../../shared/components/card-dashboard/card-dashboard.component";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [Button, TableModule, HttpClientModule, CardDashboardComponent, InputTextModule, InputTextareaModule, FormsModule],
  providers: [ApiService, DialogService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {

  ngOnInit(): void {
    this.getClients();
  }

  private api: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private readonly alert: AlertService = inject(AlertService);

  clients: any[] = [];
  clonedProducts: { [s: string]: any } = {};
  onRowEditInit(product: any) {
    this.clonedProducts[product.userName as string] = { ...product };
  }
  onRowEditSave(product: any) {
    product.numeroExterior = product.numeroExterior.toString();
    this.api.patch<ResponseBackend<any>>(`${environment.urlBackend}Clientes/UpdateUser/${product.idCliente}`, product).subscribe({
      next: response => this.alert.dinamycMessage('Hecho!!', 'Datos del cliente actualizados', 'success'),
      error: error => this.alert.dinamycMessage('Error','Intente de nuevo más tarde','error')
    });
  }
  onRowEditCancel(product: any, index: number) {
    this.clients[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }
  openModal() {
    const modal = this.dialog.open(AddClientComponent, {
      header: 'Agregar nuevo cliente',
      baseZIndex: 9999,
      width: '80%'
    })
    modal?.onClose.subscribe({
      next: response => this.getClients()
    })
  }
  getClients() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Clientes/GetClientes`).subscribe({
      next: response => {
        this.clients = response.data
      }
    })
  }

}
