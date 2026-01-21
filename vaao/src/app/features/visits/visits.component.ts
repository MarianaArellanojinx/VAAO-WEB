import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { CardDashboardComponent } from "../../shared/components/card-dashboard/card-dashboard.component";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { AddVisitComponent } from '../add-visit/add-visit.component';
import { ImageModule } from "primeng/image";

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [TableModule, CalendarModule, CardDashboardComponent, FormsModule, HttpClientModule, CommonModule, ImageModule],
  providers: [ApiService, DialogService],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss'
})
export class VisitsComponent implements OnInit {

  ngOnInit(): void {
    this.getVisitas()
  }

  private readonly api: ApiService = inject(ApiService);
  private readonly dialog: DialogService = inject(DialogService);

  date: Date = new Date();

  visitas: any[] = [];
  
  getVisitas(){
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Visitas/GetVisitas?date=${this.date.toISOString()}`).subscribe({
      next: response => {
        this.visitas = response.data;
      }
    });
  }

  open(visit?: any) {
    const modal = this.dialog.open(AddVisitComponent, {
      baseZIndex: 9999,
      header: 'Registrar visita',
      data: visit ?? null
    });
    modal.onClose.subscribe({
      next: response => this.getVisitas()
    })
  }

}
