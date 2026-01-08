import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from '../../shared/interfaces/MenuItem';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/interfaces/User';
import { RoleConst } from '../../shared/const/RoleConst';
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
export class LayoutComponent implements AfterViewInit, OnInit {

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  router: Router = inject(Router);
  auth: AuthService = inject(AuthService);

  roles: any = RoleConst;
  
  user: User | null = null;
  visible: boolean = false;
  itemsDealer: MenuItem[] = [
    {
      path: '/',
      icon: 'pi pi-home',
      label: 'Inicio'
    },
    {
      path: '/orders',
      icon: 'pi pi-truck',
      label: 'Ver pedidos asignados'
    }
  ];
  itemsClient: MenuItem[] = [
    {
      path: '/',
      icon: 'pi pi-home',
      label: 'Inicio'
    },
    {
      path: '/orders',
      icon: 'pi pi-cart-arrow-down',
      label: 'Hacer pedido'
    }
  ];
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
      path: '/clients',
      icon: 'pi pi-users',
      label: 'Clientes'
    },
    {
      path: '/dealers',
      icon: 'pi pi-truck',
      label: 'Repartidores'
    },
    {
      path: '/orders',
      icon: 'pi pi-clipboard',
      label: 'Gestionar pedidos pendientes'
    },
    {
      path: '/orders',
      icon: 'pi pi-times',
      label: 'Pedidos cancelados'
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
  endSession() {
    this.auth.deleteUser();
    this.user = null;
    this.navigate('/auth')
  }
}
