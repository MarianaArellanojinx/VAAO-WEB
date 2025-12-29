import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { DialogService } from 'primeng/dynamicdialog';
import { AddDealerComponent } from '../add-dealer/add-dealer.component';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-dealers',
  standalone: true,
  imports: [Button, TableModule, CardComponent],
  providers: [DialogService],
  templateUrl: './dealers.component.html',
  styleUrl: './dealers.component.scss'
})
export class DealersComponent {

  dialog: DialogService = inject(DialogService);

  openModal(): void {
    this.dialog.open(AddDealerComponent, {
      header: 'Agregar nuevo repartidor',
      width: '80%'
    })
  }

}
