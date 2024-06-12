import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EbookMakerService {

  constructor(private http: HttpClient) { } private getStandardOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }
  getTemplates() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/template/', options).pipe(
      catchError(error => this.handleError(error, 'getTemplates'))
    );
  }
  getTemplateContent(fileId: string): Observable<Blob> {
    return this.http.get('http://127.0.0.1:8000/api/getTemplateById/?id=' + fileId, { responseType: 'blob' });
  }
  private handleError(error: HttpErrorResponse, context: string) {
    console.error(`Error encountered in ${context}:`, error);
    if (error.status === 0) {
      console.error('There is an issue with the client or network: ', error.message);
    } else {
      console.error('Server-side error: ', error.error);
    }
    return throwError(() => new Error(`Cannot retrieve data in ${context} from the server, please try again.`));
  }
}
