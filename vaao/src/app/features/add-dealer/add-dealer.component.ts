import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { ApiService } from '../../infrastructure/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { User } from '../../shared/interfaces/User';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { Button } from "primeng/button";

@Component({
  selector: 'app-add-dealer',
  standalone: true,
  imports: [InputTextModule, HttpClientModule, FormsModule, DropdownModule, Button],
  providers: [ApiService],
  templateUrl: './add-dealer.component.html',
  styleUrl: './add-dealer.component.scss'
})
export class AddDealerComponent implements OnInit {

  ngOnInit(): void {
    this.getAllUsers();
  }

  api: ApiService = inject(ApiService);

  name: string = '';
  lastName: string = '';
  idUser: number | undefined = undefined;
  users: User[] = [];

  getAllUsers(): void {
    this.api.get<ResponseBackend<User[]>>(`${environment.urlBackend}Users/GetUsers`).subscribe({
      next: response =>{
        this.users = response.data;
      },
      error: error => {

      }
    })
  }

  saveDealer(): void {
    this.api.post<ResponseBackend<boolean>>(``, {});
  }

}
