import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-detail-sells',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './detail-sells.component.html',
  styleUrl: './detail-sells.component.scss'
})
export class DetailSellsComponent implements OnInit {

  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);

  dataTable!: any;

  ngOnInit(): void {
    switch(this.config.data.id){
      case 1:
        this.dataTable = this.config.data.data.tableTodayDetail;
      break;
      case 2:
        this.dataTable = this.config.data.data.tableWeekDetail;
      break;
      case 3:
        this.dataTable = this.config.data.data.tableMonthDetail;
      break;
    }
    console.log(this.dataTable)
  }
  
}
