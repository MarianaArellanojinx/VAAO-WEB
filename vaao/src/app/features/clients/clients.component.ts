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

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule],
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
    this.dialog.open(AddClientComponent, {
      header: 'Agregar nuevo cliente',
      baseZIndex: 9999,
      width: '80%'
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
