import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from "primeng/button";

@Component({
  selector: 'app-report-download-card',
  standalone: true,
  imports: [Button, CommonModule],
  templateUrl: './report-download-card.component.html',
  styleUrl: './report-download-card.component.scss'
})
export class ReportDownloadCardComponent {
  @Input() title!: string;
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() fields: string[] = [];

  @Output() download = new EventEmitter<void>();

  onDownload() {
    this.download.emit();
  }
}
