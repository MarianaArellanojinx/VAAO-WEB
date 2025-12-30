import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /**
   * Convierte un File o Blob a Base64
   * @param file Archivo de imagen
   * @param removePrefix Si es true, elimina "data:image/...;base64,"
   */
  fileToBase64(
    file: File | Blob,
    removePrefix: boolean = false
  ): Promise<string> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;

        if (removePrefix) {
          resolve(result.split(',')[1]);
        } else {
          resolve(result);
        }
      };

      reader.onerror = error => reject(error);

      reader.readAsDataURL(file);
    });
  }
}
