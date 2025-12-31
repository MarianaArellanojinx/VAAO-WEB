import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'

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
export class HomeComponent {

  private router: Router = inject(Router);

  navigate(url:string) {
    this.router.navigate([url]);
  }

}
