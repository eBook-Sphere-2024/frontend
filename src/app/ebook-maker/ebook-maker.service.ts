import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../../shared/models/User';

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
  publish(pdfDocument: any, title: string, author: string, description: string, categories: any[]) {

    const blob = new Blob([pdfDocument], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('pdfFile', blob, title + '.pdf'); // Assuming title is used as the filename
    formData.append('ebookTitle', title);
    formData.append('authorId', author);
    formData.append('description', description);

    let categoriesList: any[] = [];
    // Append each category to FormData
    categories.forEach(category => {
      categoriesList.push(category.id);
    });

    categoriesList.forEach(category => {
      formData.append('categories', category);
    })
    return this.http.post<any>('http://127.0.0.1:8000/api/publish/', formData).pipe(
      catchError(error => this.handleError(error, 'publish'))
    );
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
