import { AfterViewInit, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from '../../shared/interfaces/MenuItem';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/User';
declare var particlesJS: any;
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements AfterViewInit{

  router: Router = inject(Router);
  auth: AuthService = inject(AuthService);
  
  user: User = this.auth.getUser();
  visible: boolean = false;
  items: MenuItem[] = [
    {
      path: '/',
      icon: 'pi pi-home',
      label: 'Inicio'
    },
    {
      path: '/dashboard',
      icon: 'pi pi-chart-bar',
      label: 'Dashboard'
    },
    {
      path: '/users',
      icon: 'pi pi-users',
      label: 'Usuarios'
    },
    {
      path: '/clients',
      icon: 'pi pi-users',
      label: 'Clientes'
    },
    {
      path: '/dealers',
      icon: 'pi pi-box',
      label: 'Repartidores'
    },
    {
      path: '/orders',
      icon: 'pi pi-cart-arrow-down',
      label: 'Compras'
    }
  ];

  ngAfterViewInit() {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 300,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.8,
          random: true
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: false
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'bottom',
          random: true,
          straight: false,
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true
        }
      },
      retina_detect: true
    });
  }
  
  navigate(url: string) {
    this.router.navigate([url])
    this.visible = false;
  }
  open(){
    this.visible = true;
  }
}
