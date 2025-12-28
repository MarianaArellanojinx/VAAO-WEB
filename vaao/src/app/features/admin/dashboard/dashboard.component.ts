import { Component } from '@angular/core';
import { CardComponent } from "../../../shared/components/card/card.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { ChartModule } from 'primeng/chart'
import { TableModule } from 'primeng/table'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    FontAwesomeModule,
    ChartModule,
    TableModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  snowflake: any = faSnowflake;

  historicoVentas30DiasDataset = {
    labels: [
      'Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7',
      'Día 8', 'Día 9', 'Día 10', 'Día 11', 'Día 12', 'Día 13', 'Día 14',
      'Día 15', 'Día 16', 'Día 17', 'Día 18', 'Día 19', 'Día 20', 'Día 21',
      'Día 22', 'Día 23', 'Día 24', 'Día 25', 'Día 26', 'Día 27', 'Día 28',
      'Día 29', 'Día 30'
    ],
    datasets: [
      {
        label: 'Bolsas de hielo vendidas',
        data: [
          280, 300, 260, 290, 310, 340, 360,
          380, 400, 420, 390, 370, 360, 410,
          450, 480, 500, 520, 490, 470, 460,
          440, 430, 410, 420, 450, 480, 500,
          520, 540
        ],
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        borderRadius: 6,
        backgroundColor: 'rgba(147, 197, 253, 0.6)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb'
      }
    ]
  };
  metaDiariaPorClienteDataset_10 = {
    labels: [
      'Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E',
      'Cliente F', 'Cliente G', 'Cliente H', 'Cliente I', 'Cliente J'
    ],
    datasets: [
      {
        label: 'Meta diaria',
        data: [100, 130, 80, 150, 110, 90, 160, 120, 70, 140],
        borderColor: '#1e40af',
        type: 'line',
        tension: 0.4
      },
      {
        label: 'Ventas reales (bolsas)',
        data: [85, 120, 60, 140, 95, 70, 160, 110, 55, 130],
        backgroundColor: '#93c5fd',
        borderRadius: 8,
        type: 'bar'
      }
    ]
  };
  estatusPedidosPorClienteDataset = {
    labels: [
      'Cliente A',
      'Cliente B',
      'Cliente C',
      'Cliente D',
      'Cliente E'
    ],
    datasets: [
      {
        label: 'Pendiente',
        data: [3, 5, 2, 6, 1],
        backgroundColor: '#fde047',
        borderRadius: 8
      },
      {
        label: 'En preparación',
        data: [4, 3, 1, 5, 2],
        backgroundColor: '#60a5fa',
        borderRadius: 8
      },
      {
        label: 'En reparto',
        data: [2, 4, 0, 3, 1],
        backgroundColor: '#38bdf8',
        borderRadius: 8
      },
      {
        label: 'Entregado',
        data: [20, 18, 12, 22, 15],
        backgroundColor: '#22c55e',
        borderRadius: 8
      },
      {
        label: 'Cancelado',
        data: [1, 0, 0, 2, 0],
        backgroundColor: '#ef4444',
        borderRadius: 8
      }
    ]
  };
  options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#ffffff' }
      },
      y: {
        stacked: true,
        ticks: { color: '#ffffff' }
      }
    }
  };

  tableData: any[] = [
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
    {a: 'Hola'},
  ];
}
