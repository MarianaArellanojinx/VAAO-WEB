import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

declare var particlesJS: any;
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements AfterViewInit{
 

  ngAfterViewInit() {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 160,
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
}
