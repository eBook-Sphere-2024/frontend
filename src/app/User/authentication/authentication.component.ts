import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserServices } from '../../User/user.service';
import { User } from '../../../shared/models/User';
import { Router } from '@angular/router';
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  userDetails:User = {
    id:0,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  };

  @ViewChild('container') container!: ElementRef;
  @ViewChild('registerBtn') registerBtn!: ElementRef;
  @ViewChild('loginBtn') loginBtn!: ElementRef;

  constructor(private userService: UserServices,private router: Router) {}

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
          // Handle successful registration here, e.g., redirect to login page
          this.router.navigate(['/profile']);
        },
        error => {
          console.error('Registration failed:', error);
          // Handle registration failure here
        }
      );
    
  }
}
