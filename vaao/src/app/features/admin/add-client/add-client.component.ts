import { Component } from '@angular/core';
import { InputTextModule } from "primeng/inputtext";
import { Button } from "primeng/button";

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [InputTextModule, Button],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {

}
