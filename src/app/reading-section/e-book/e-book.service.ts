import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { eBookItem } from '../../../shared/models/eBookItem';

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
    };
  }

  getBooks() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/ebooks/', options).pipe(
      catchError(error => this.handleError(error, 'getBooks'))
    );
  }

  getBookById(id: string) {
    let options = this.getStandardOptions();
    return this.http.get<eBookItem>('http://127.0.0.1:8000/api/ebooks?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'getBookById'))
    );
  }

  getCategories() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/ebook_categories/', options).pipe(
      catchError(error => this.handleError(error, 'getCategories'))
    );
  }

  filter_eBooks_by_category(category: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/filter?id=' + category, options).pipe(
      catchError(error => this.handleError(error, 'filter_eBooks_by_category'))
    );
  }

  get_Comments() {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/comments/', options).pipe(
      catchError(error => this.handleError(error, 'get_Comments'))
    );
  }

  get_comment_replies(id: string, ebookId: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/replies?id=' + id + '&ebookId=' + ebookId, options).pipe(
      catchError(error => this.handleError(error, 'get_comment_replies'))
    );
  }
  get_directSearch(query: string) {
    let options = this.getStandardOptions(); // Obtains standard HTTP options
    return this.http.get('http://127.0.0.1:8000/api/search/?query=' + query, options).pipe(
      catchError(error => this.handleError(error, 'get_directSearch'))
    );
  }
  get_InDirectSearch(query: string) {
    let options = this.getStandardOptions();
    options = { ...options, timeout: 20000 };
    return this.http.get('http://127.0.0.1:8000/api/related/?query=' + query, options).pipe(
      catchError(error => this.handleError(error, 'get_indirectSearch'))
    );
  }
  //to be removed later
  get_user_profile(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/profile?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_user_profile'))
    );
  }
  download_eBook(fileId: string, localPath: string) {
    let options = this.getStandardOptions();
    const body = {
      "fileId": fileId,
      "localPath": localPath
    }
    console.log(body)
    return this.http.post('http://127.0.0.1:8000/api/download/', body, options).pipe(
      catchError(error => this.handleError(error, 'download_eBook'))
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