import { AfterViewInit, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from '../../shared/interfaces/MenuItem';
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

  visible: boolean = false;
  items: MenuItem[] = [
    {
      path: '/dashboard',
      icon: 'pi pi-chart-bar',
      label: 'Dashboard'
    },
    {
      path: '/dashboard',
      icon: 'pi pi-chart-bar',
      label: 'Dashboard'
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
          random: false,
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
  }
  open(){
    this.visible = true;
  }
}
