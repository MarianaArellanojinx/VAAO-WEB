import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { User } from '../../../shared/interfaces/User';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    FormsModule,
    Button
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  users: User[] = [
    {
      idUser: 1,
      userName: 'Gerardo Chavez',
      userPassword: '1234',
      isActive: true,
      rol: 1
    }
  ]

}
