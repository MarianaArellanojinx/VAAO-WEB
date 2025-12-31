import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../infrastructure/api.service';
import { ResponseBackend } from '../../shared/interfaces/ResponseBackend';
import { User } from '../../shared/interfaces/User';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private api: ApiService = inject(ApiService);
  private router: Router = inject(Router);
  private auth: AuthService = inject(AuthService);
  private alert: AlertService = inject(AlertService);

  username: string = '';
  password: string = '';
  loading: boolean = false;

  login(): void {
    const payload = {
      userName: this.username,
      password: this.password
    }
    this.api.post<ResponseBackend<User>>(`${environment.urlBackend}Users/Login/login`, payload).subscribe({
      next: response => {
        this.alert.dinamycMessage('Bienvenido!!', `Bienvenido de nuevo ${this.username}`, 'success')
        this.auth.addUser(response.data);
        this.router.navigate([''])
      },
      error: error => {

      }
    })
  }

}
