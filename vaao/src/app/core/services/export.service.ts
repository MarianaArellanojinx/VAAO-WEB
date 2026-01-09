import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporta una lista genérica a Excel
   * Web  -> descarga normal
   * Android -> guarda en Documentos
   */
  async exportToExcel<T>(
    data: T[],
    fileName: string,
    sheetName: string = 'Sheet1'
  ): Promise<void> {

    if (!data || data.length === 0) {
      throw new Error('La lista está vacía');
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName]
    };

    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    if (Capacitor.isNativePlatform()) {
      await this.saveExcelFileAndroid(excelBuffer, fileName);
    } else {
      this.saveExcelFileWeb(excelBuffer, fileName);
    }
  }

  // =======================
  // WEB
  // =======================
  private saveExcelFileWeb(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
    saveAs(blob, `${fileName}.xlsx`);
  }

  // =======================
  // ANDROID / IOS
  // =======================
  private async saveExcelFileAndroid(
    buffer: ArrayBuffer,
    fileName: string
  ): Promise<void> {

    const base64 = this.arrayBufferToBase64(buffer);

    await Filesystem.writeFile({
      path: `${fileName}.xlsx`,
      data: base64,
      directory: Directory.Documents,
      recursive: true
    });

    alert(`Archivo guardado en Documentos/${fileName}.xlsx`);
  }

  // =======================
  // Utils
  // =======================
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  }
}
