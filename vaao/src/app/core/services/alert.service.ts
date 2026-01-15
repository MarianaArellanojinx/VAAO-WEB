import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  dinamycMessage(title: string, text: string, icon: 'success' | 'error' | 'info' | 'question') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    });
  }

  confirmMessage(onConfirmAction: () => void) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirmAction()
      }else {
        this.dinamycMessage('Hecho!!', 'Se ha cancelado la acción', 'info')
      }
    });
  }
}
