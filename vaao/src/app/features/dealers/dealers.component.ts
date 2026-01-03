import { Component, inject, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogService } from 'primeng/dynamicdialog';
import { AddDealerComponent } from '../add-dealer/add-dealer.component';
import { CardComponent } from "../../shared/components/card/card.component";
import { ApiService } from '../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { CardDashboardComponent } from "../../shared/components/card-dashboard/card-dashboard.component";

@Component({
  selector: 'app-dealers',
  standalone: true,
  imports: [Button, TableModule, CardComponent, HttpClientModule, CardDashboardComponent],
  providers: [DialogService, ApiService],
  templateUrl: './dealers.component.html',
  styleUrl: './dealers.component.scss'
})
export class DealersComponent implements OnInit {

  ngOnInit(): void {
    this.getDealers();
  }

  private dialog: DialogService = inject(DialogService);
  private api: ApiService = inject(ApiService);

  dealers: any[] = [];

  getDealers(){
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Repartidores/GetRepartidores`).subscribe({
      next: response => {
        this.dealers = response.data;
      }
    })
  }

  openModal(): void {
    const modal = this.dialog.open(AddDealerComponent, {
      header: 'Agregar nuevo repartidor',
      width: '80%'
    })
    modal?.onClose.subscribe({
      next: response => this.getDealers()
    })
  }

}
