import { Component, inject, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [ImageModule, HttpClientModule, CommonModule],
  providers: [ApiService],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent implements OnInit {

  ngOnInit(): void {
    this.id = this.config.data;
    this.getDetail();
  }
  private readonly api: ApiService = inject(ApiService);
  private readonly config: DynamicDialogConfig = inject(DynamicDialogConfig);

  id:number = 0;
  data: any = {};

  getDetail(): void {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Entregas?pedidoId=${this.id}`).subscribe({
      next: response => {
        this.data = response.data;
      }
    }); 
  }

}
