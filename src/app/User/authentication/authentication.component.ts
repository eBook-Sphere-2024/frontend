import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserServices } from '../../User/user.service';
import { User } from '../../../shared/models/User';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  userDetails: User = {} as User;

  @ViewChild('container') container!: ElementRef;
  @ViewChild('registerBtn') registerBtn!: ElementRef;
  @ViewChild('loginBtn') loginBtn!: ElementRef;

  constructor(private userService: UserServices, private router: Router) { }

  ngAfterViewInit() {
    this.registerBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('active');
    });

    this.loginBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('active');
    });
  }
  registerUser() {
    this.userService.post_register(this.userDetails)
      .subscribe(
        response => {
          console.log('Registration successful:', response);
          // Store the response in session storage
          sessionStorage.setItem('Token', JSON.stringify(response));
          this.router.navigate(['/profile']);
        },
        error => {
          console.error('Registration failed:', error);
        }
      );

  }
  loginUser() {
    this.userService.login(this.userDetails)
      .subscribe(
        response => {
          console.log('Login successful:', response);
          // Store the response in session storage
          sessionStorage.setItem('Token', JSON.stringify(response));
          this.router.navigate(['/User']);
        },
        error => {
          console.error('Registration failed:', error);
          // Handle registration failure here
        }
      );
  }
  userData= new FormGroup({
    first_name: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
    last_name: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
    username: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]),
  })
}
