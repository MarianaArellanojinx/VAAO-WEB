import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /** 
   * Exporta una lista genérica a Excel y la descarga
   * @param data Lista genérica
   * @param fileName Nombre del archivo sin extensión
   * @param sheetName Nombre de la hoja
   */
  exportToExcel<T>(
    data: T[],
    fileName: string,
    sheetName: string = 'Sheet1'
  ): void {

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
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
    saveAs(blob, `${fileName}.xlsx`);
  }

}
