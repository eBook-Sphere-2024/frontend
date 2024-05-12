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
      catchError(error => this.handleError(error, 'register'))
    );
  }
  login(userDetails: User) {
    let options = this.getStandardOptions();
    let body = {
      "username": userDetails.username,
      "password": userDetails.password
    }

    return this.http.post<User>('http://127.0.0.1:8000/api/login/', body, options).pipe(
      catchError(error => this.handleError(error, 'login'))
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
    console.log(id)
    let options = this.getStandardOptions();
    return this.http.get('http://127.0.0.1:8000/api/profile?id=' + id, options).pipe(
      catchError(error => this.handleError(error, 'get_user_profile'))
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
