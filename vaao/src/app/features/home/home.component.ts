import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/User';
import { RoleConst } from '../../shared/const/RoleConst';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private router: Router = inject(Router);
  private readonly auth: AuthService = inject(AuthService);

  user!: User | null;
  roles: any = RoleConst;

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

  navigate(url:string) {
    this.router.navigate([url]);
  }

}
