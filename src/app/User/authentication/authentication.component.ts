import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserServices } from '../../User/user.service';
import { User } from '../../../shared/models/User';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../shared/services/EventService';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  failMessage: string = '';
  sendFail: boolean = false;
  userData: FormGroup;
  userlogin: FormGroup;
  loginFialure: string = '';
  usernameFail: string = '';
  browseBack: string = '';
  @ViewChild('container') container!: ElementRef;
  @ViewChild('registerBtn') registerBtn!: ElementRef;
  @ViewChild('loginBtn') loginBtn!: ElementRef;

  constructor(
    private userService: UserServices,
    private router: Router,
    private fb: FormBuilder, // Inject FormBuilder
    private events: EventService
  ) {
    this.userData = this.fb.group({ // Initialize the FormGroup
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~])[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+$'),
        Validators.minLength(8)
      ]],
    });
    this.userlogin = this.fb.group({ // Initialize the FormGroup
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.events.listen('openSigninDialog', (data: string) => {
      this.browseBack = data;
    })
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
    this.usernameFail = '';
    this.sendFail = false;
    this.userService.post_register(this.userData.value)
      .subscribe(
        response => {
          sessionStorage.setItem('Token', JSON.stringify(response));
          if (this.browseBack == '' || this.browseBack == '/**') {
            this.router.navigate(['/User/profile']);
          } else {
            this.router.navigate([this.browseBack]);
          }
        },
        error => {
          if (error.status == 400 && error.error.non_field_errors[0] == 'Username already exists')
            this.usernameFail = 'Username already exists'
          else {
            this.sendFail = true;
            this.failMessage = error.error.non_field_errors[0];
          }
        }
      );
  }
  loginUser() {
    this.userService.login(this.userlogin.value)
      .subscribe(
        response => {
          sessionStorage.setItem('Token', JSON.stringify(response));
          if (this.browseBack == '' || this.browseBack == '/**') {
            this.router.navigate(['/User/profile']);
          } else {
            this.router.navigate([this.browseBack]);
          }
        },
        (error:any) => {
          console.log(error);
          console.log(error.error);
          console.log(error.error.message);
          if (error.status == 400 && error.error.message == 'Username or password is incorrect') {
            this.loginFialure = 'Username or password is incorrect';
            this.sendFail = true;
            console.log(error);
          }
        }
      );
  }
}
