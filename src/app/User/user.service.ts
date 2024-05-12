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

  post_register(userDetails: User){
    let options = this.getStandardOptions();
    return this.http.post<User>('http://127.0.0.1:8000/api/users/', userDetails, options).pipe(
      catchError(error => this.handleError(error, 'register'))
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
