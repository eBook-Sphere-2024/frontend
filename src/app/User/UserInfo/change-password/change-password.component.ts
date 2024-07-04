import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserServices } from '../../user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userProfile!: User;
  userData: FormGroup;
  userUpdate!: User;
  username_fail: string = '';
  showPassword: boolean = false;
  changeSuccefully: boolean = false;
  changeFail: boolean = false;
  failMessage: string = '';
  constructor(
    private userService: UserServices,
    private fb: FormBuilder
  ) {
    this.userData = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    let changePassword = document.getElementById('changePassword');
    let token = sessionStorage.getItem('Token');
    if (token) {
      if (changePassword) {
        changePassword.style.display = 'block';
      }
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              this.userProfile.avatar = data.profile_image;

              // Set form values here, inside the subscription block
              this.userData.get('first_name')?.setValue(this.userProfile.first_name);
              this.userData.get('last_name')?.setValue(this.userProfile.last_name);
              this.userData.get('username')?.setValue(this.userProfile.username);
              this.userData.get('email')?.setValue(this.userProfile.email);
            },
            (error) => {
              console.error('Error fetching user profile:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    } else {
      if (changePassword) {
        changePassword.style.display = 'none';
      }
    }
  }
  ChangePassword() {
    let data = {
      username: this.userData.get('username')?.value,
      old_password: this.userData.get('old_password')?.value,
      new_password: this.userData.get('new_password')?.value,
    }
    this.userService.change_password(data).subscribe(
      (data: any) => {
        this.changeSuccefully = true
        this.changeFail = false
      },
      error => {
        this.changeFail = true
        this.changeSuccefully = false
        this.failMessage = error.error.errors.non_field_errors[0]
      }
    );
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('new_password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
