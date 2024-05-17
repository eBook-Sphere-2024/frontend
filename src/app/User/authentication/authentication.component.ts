import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserServices } from '../../User/user.service';
import { User } from '../../../shared/models/User';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  userData: FormGroup;
  userlogin: FormGroup;

  @ViewChild('container') container!: ElementRef;
  @ViewChild('registerBtn') registerBtn!: ElementRef;
  @ViewChild('loginBtn') loginBtn!: ElementRef;

  constructor(
    private userService: UserServices,
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.userData = this.fb.group({ // Initialize the FormGroup
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')], Validators.minLength(8)],
    });

    this.userlogin = this.fb.group({ // Initialize the FormGroup
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.registerBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('active');
    });

    this.loginBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('active');
    });
  }

  registerUser() {
    // Access form values using this.userData.value
    this.userService.post_register(this.userData.value)
      .subscribe(
        response => {
          console.log('Registration successful:', response);
          sessionStorage.setItem('Token', JSON.stringify(response));
          this.router.navigate(['/User/profile']);
        },
        error => {
          console.error('Registration failed:', error);
        }
      );
  }

  loginUser() {
    this.userService.login(this.userlogin.value)
      .subscribe(
        response => {
          console.log('Login successful:', response);
          sessionStorage.setItem('Token', JSON.stringify(response));
          this.router.navigate(['/User/profile']);
        },
        error => {
          console.error('Login failed:', error);
        }
      );
  }
}
