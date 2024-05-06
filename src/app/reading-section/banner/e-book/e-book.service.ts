import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { eBookItem } from '../../../../shared/models/eBookItem';
@Injectable({
  providedIn: 'root'
})
export class EBookService {


  constructor(private http: HttpClient) { }
  private getStandardOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }
  }


  getBooks() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/ebooks/', options).pipe(catchError(this.handleError));
  }
  getBookById(id: string) {
    let options = this.getStandardOptions();
    return this.http.get<eBookItem>('http://127.0.0.1:8000/api/ebooks?id=' + id, options).pipe(catchError(this.handleError));
  }
  getCategories() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/ebook_categories/', options).pipe(catchError(this.handleError));
  }
  filter_eBooks_by_category(category: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/filter?id=' + category, options).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error encountered:', error);
    if (error.status === 0) {
      console.error('There is an issue with the client or network: ', error.message);
    } else {
      console.error('Server-side error: ', error.error);
    }
    return throwError(() => new Error('Cannot retrieve eBooks from the server, please try again again.'));
  }
}
