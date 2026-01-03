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

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule, CardDashboardComponent],
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

  clients: any[] = [];

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
