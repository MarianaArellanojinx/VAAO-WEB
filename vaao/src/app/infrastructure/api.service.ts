import { HttpParams, HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http: HttpClient = inject(HttpClient);

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `Código del servidor: ${error.status}, ` +
          `Cuerpo del error: ${error.error}`
      );
    }
    return throwError('Algo salió mal; por favor intente nuevamente.');
  }
  get<T>(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http
      .get<T>(url, { params, headers })
      .pipe(catchError(this.handleError));
  }
  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }
  put<T>(url: string, body: any, headers?: HttpHeaders) {
    return this.http
      .put<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }
  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(url, { headers })
      .pipe(catchError(this.handleError));
  }
}
