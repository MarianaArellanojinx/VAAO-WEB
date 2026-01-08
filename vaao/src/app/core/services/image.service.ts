import { Injectable } from '@angular/core';
import { ImageConfig } from '../../shared/interfaces/ImageConfig';

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
    options?: ImageConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if(options !== undefined){
          if (width > options?.maxWidth || height > options?.maxHeight) {
            const ratio = Math.min(options?.maxWidth / width, options?.maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('No se pudo obtener el contexto del canvas');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL(options?.mimeType, options?.quality);
        resolve(options?.removePrefix ? base64.split(',')[1] : base64);
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}
