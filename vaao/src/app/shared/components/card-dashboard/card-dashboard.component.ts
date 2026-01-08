import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: 'app-card-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule
],
  templateUrl: './card-dashboard.component.html',
  styleUrl: './card-dashboard.component.scss'
})
export class CardDashboardComponent {

  @Input() loading: boolean = false;
  @Input() icon: string = 'pi pi-file';
  @Input() title!: string;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  
}
