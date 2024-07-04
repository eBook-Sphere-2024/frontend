import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { eBookItem } from '../../../shared/models/eBookItem';
import { Comment } from '../../../shared/models/Comment';
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
  getBookRating(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/rate?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'getBookRating'))
    );
  }
  rate_ebook(id: string, userId: string, rating: number) {
    let options = this.getStandardOptions();
    let body = {
      "user": userId,
      "ebook": id,
      "rate": rating
    }
    return this.http.put('http://127.0.0.1:8000/api/rate/', body, options).pipe(
      catchError(error => this.handleError(error, 'rate_ebook'))
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

  get_Comments(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/comments?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_Comments'))
    );
  }

  get_comment_replies(id: string, ebookId: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/replies?id=' + id + '&ebookId=' + ebookId, options).pipe(
      catchError(error => this.handleError(error, 'get_comment_replies'))
    );
  }
  addComment(userId: string, ebookId: string, content: string, _comment: Comment | null = null) {
    let options = this.getStandardOptions();
    let body;
    if (_comment == null || typeof _comment === 'undefined') {
      body = {
        "user": userId,
        "ebook": ebookId,
        "content": content
      }
    }
    else {
      const reply_to = _comment ? _comment.id : null;
      body = {
        "user": userId,
        "ebook": ebookId,
        "content": content,
        "reply_to": reply_to
      }
    }

    return this.http.post<Comment>('http://127.0.0.1:8000/api/comments/', body, options).pipe(
      catchError(error => this.handleError(error, 'addComment'))
    );
  }
  edit_comment(comment: Comment) {
    let options = this.getStandardOptions();
    let body = {
      "content": comment.content
    }
    return this.http.patch('http://127.0.0.1:8000/api/comments/?id=' + comment.id, body, options).pipe(
      catchError(error => this.handleError(error, 'edit_comment'))
    )
  }
  delete_comment(id: string) {
    let options = this.getStandardOptions();
    return this.http.delete('http://127.0.0.1:8000/api/comments?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'delete_comment'))
    )
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
  download_eBook(fileId: string) {
    let options = this.getStandardOptions();
    const body = {
      "fileId": fileId
    }
    return this.http.post('http://127.0.0.1:8000/api/download/', body, options).pipe(
      catchError(error => this.handleError(error, 'download_eBook'))
    );
  }
  getEbookContent(ebookId: string): Observable<Blob> {
    return this.http.get('http://127.0.0.1:8000/api/ebookContent/?id=' + ebookId, { responseType: 'blob' }).pipe(map((res: Blob) => res));;
  }

  getCommentAnalysis(id: string){
   let options = this.getStandardOptions();
   return this.http.get('http://127.0.0.1:8000/api/CommentAnalysis/?book_id=' + id, options).pipe(
    catchError(error => this.handleError(error, 'get_indirectSearch'))
  );
  }
  geteBookAnalysis(id: string){
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/ReaderAnalysisSpecificBook/?ebook_id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_indirectSearch'))
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