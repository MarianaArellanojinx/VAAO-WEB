import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { CardDashboardComponent } from "../../../shared/components/card-dashboard/card-dashboard.component";
import { CommonModule } from '@angular/common';
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-corte',
  standalone: true,
  imports: [TableModule, CommonModule, CalendarModule, FormsModule],
  templateUrl: './corte.component.html',
  styleUrl: './corte.component.scss'
})
export class CorteComponent {

  fechaSeleccionada!: Date;

  ventas = [
    {
      negocio: 'Tecate Six Pirámide',
      cliente: 'Diana Solís',
      hora: '10:35',
      metodoPago: 'Efectivo',
      importe: 350
    }
  ];

}
