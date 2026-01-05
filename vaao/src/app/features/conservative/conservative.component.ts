import { Component, inject, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CardDashboardComponent } from "../../shared/components/card-dashboard/card-dashboard.component";

@Component({
  selector: 'app-conservative',
  standalone: true,
  imports: [Button, TableModule, HttpClientModule, CardDashboardComponent],
  providers: [ApiService],
  templateUrl: './conservative.component.html',
  styleUrl: './conservative.component.scss'
})
export class ConservativeComponent implements OnInit {

  ngOnInit(): void {
    this.get();
  }

  private readonly api: ApiService = inject(ApiService);

  conservadores: any[] = [];

  get() {
    this.api.get<ResponseBackend<any>>(`${environment.urlBackend}Conservador/GetConservadores`).subscribe({
      next: response => {
        this.conservadores = response.data;
      }
    });
  }
}
