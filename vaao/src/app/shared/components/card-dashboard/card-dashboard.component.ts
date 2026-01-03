import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card-dashboard.component.html',
  styleUrl: './card-dashboard.component.scss'
})
export class CardDashboardComponent {

  @Input() icon: string = 'pi pi-file';
  @Input() title!: string;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  
}
