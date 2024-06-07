import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../shared/models/User';

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
    console.log(userDetails)
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
  get_createdBooks(id: string) {
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/autherBooks/?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_createdBooks'))
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
