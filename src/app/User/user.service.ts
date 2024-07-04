import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../shared/models/User';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserServices {

  constructor(private http: HttpClient) { }

  private getStandardOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  post_register(userDetails: User) {
    let options = this.getStandardOptions();
    let body = {
      "first_name": userDetails.first_name,
      "last_name": userDetails.last_name,
      "username": userDetails.username,
      "email": userDetails.email,
      "password": userDetails.password
    }
    return this.http.post<User>('http://127.0.0.1:8000/api/users/', body, options).pipe(
    );
  }
  login(userDetails: User) {
    let options = this.getStandardOptions();
    let body = {
      "username": userDetails.username,
      "password": userDetails.password
    }

    return this.http.post<User>('http://127.0.0.1:8000/api/login/', body, options).pipe(

    );
  }
  userProfile(token: string) {
    let options = this.getStandardOptions();
    options.headers = options.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>('http://127.0.0.1:8000/api/userByToken/', options).pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    );
  }
  get_user_profile(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/profile?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_user_profile'))
    );
  }
  update_user_profile(userDetails: User) {
    let options = this.getStandardOptions();
    let body = userDetails
    return this.http.patch<User>('http://127.0.0.1:8000/api/users/', body, options).pipe(
    );
  }
  change_password(data: any) {
    let options = this.getStandardOptions();
    let body = data
    return this.http.patch<User>('http://127.0.0.1:8000/api/changePassword/', body, options).pipe(
    );
  }
  reset_password_BY_email(data: any) {
    let options = this.getStandardOptions();
    let body = data
    return this.http.post<User>('http://127.0.0.1:8000/api/password-reset/', body, options).pipe(
    );
  }
  resetPasswordByToken(data: any, uidb64: string, token: string) {
    let options = this.getStandardOptions();
    let body = data
    return this.http.post<User>('http://127.0.0.1:8000/api/password-reset-confirm/' + uidb64 + '/' + token + '/', body, options).pipe(
    );
  }
  get_createdBooks(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/autherBooks/?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_createdBooks'))
    );
  }
  uploadAvatar(id: number, file: File) {
    const formData = new FormData();
    formData.append('user', id.toString());
    formData.append('profile_image', file);

    // Set headers to indicate multipart/form-data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    // Send the request with the FormData and headers
    return this.http.patch('http://127.0.0.1:8000/api/profile/', formData, { headers }).pipe(
      catchError(error => throwError(error))
    );
  }
  removeAvatar(id: number) {
    let options = this.getStandardOptions();
    return this.http.delete('http://127.0.0.1:8000/api/profile/?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'removeAvatar'))
    );
  }
  getFavoriteBooksForUser(id: number) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/FavoriteBooks/?user_id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'getFavoriteBooksForUser'))
    );
  }
  AddToFavorites(data: any) {
    let options = this.getStandardOptions();
    let body = data;
    return this.http.post('http://127.0.0.1:8000/api/FavoriteBooks/', body, options).pipe(
      catchError(error => this.handleError(error, 'AddToFavorites'))
    );
  }
  RemoveFromFavorites(data: any) {
    let options = {
      ...this.getStandardOptions(),
      body: data
    };
    return this.http.delete('http://127.0.0.1:8000/api/FavoriteBooks/', options).pipe(
      catchError(error => this.handleError(error, 'RemoveFromFavorites'))
    );
  }
  getReaderAnalysis() {
    let options = this.getStandardOptions();
    return this.http.get<any>('http://127.0.0.1:8000/api/ReaderAnalysis/').pipe(
      catchError(error => this.handleError(error, 'getReaderAnalysis'))
    );
  }
  getSpecificReaderAnalysis(user_id: string, ebook_id: string) {
    let options = this.getStandardOptions();
    return this.http.get<any>('http://127.0.0.1:8000/api/SpecificReaderAnalysis/?user_id=' + user_id + '&ebook_id=' + ebook_id).pipe(
      catchError(error => this.handleError(error, 'SpecificReaderAnalysis'))
    );
  }
  updateReaderAnalysis(user_id: number, ebook_id: string, dataPost: any, dataPatch: any) {
    let options = this.getStandardOptions();

    return this.http.get<any>('http://127.0.0.1:8000/api/ReaderAnalysis/').pipe(
      switchMap((analyses: any[]) => {
        const existingAnalysis = analyses.find(analysis => analysis.user == user_id && analysis.ebook == ebook_id);
        if (existingAnalysis) {
          // If exists, update it using PATCH
          return this.http.patch('http://127.0.0.1:8000/api/ReaderAnalysis/?id=' + existingAnalysis.id, dataPatch, options).pipe(
            catchError(error => this.handleError(error, 'updateReaderAnalysis (patch)'))
          );
        } else {
          // If not exists, create a new one using POST
          return this.http.post('http://127.0.0.1:8000/api/ReaderAnalysis/', dataPost, options).pipe(
            catchError(error => this.handleError(error, 'updateReaderAnalysis (post)'))
          );
        }
      }),
      catchError(error => this.handleError(error, 'updateReaderAnalysis (get)'))
    );
  }
  BooksAnalysisNumbers(user_id: string, book_id: string) {
    let options = this.getStandardOptions();
    return this.http.get<any>('http://127.0.0.1:8000/api/BookAnalyticsNumbers/?author_id=' + user_id + '&book_id=' + book_id, options).pipe(
      catchError(error => this.handleError(error, 'BooksAnalysisNumbers'))
    );
  }
  
  ContactMail(data: any) {
    let options = this.getStandardOptions();
    let body = data
    return this.http.post('http://127.0.0.1:8000/api/contact/', body, options).pipe(
    );
  }
  private handleError(error: HttpErrorResponse, context: string) {
    console.error(`Error encountered in ${context}:`, error['error']);
    if (error.status === 0) {
      console.error('There is an issue with the client or network: ', error.message);
    } else {
      console.error('Server-side error: ', error.error);
    }
    return throwError(() => new Error(`Cannot retrieve data in ${context} from the server, please try again.`));
  }
}