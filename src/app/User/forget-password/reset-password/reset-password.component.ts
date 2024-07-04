import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserServices } from '../../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  userPassword: FormGroup;
  validationError: string = '';
  validationSuccess: string = '';

  constructor(private fb: FormBuilder, private userService: UserServices, private route: ActivatedRoute) {
    this.userPassword = this.fb.group({
      new_password: ['',  [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~])[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+$'),
        Validators.minLength(8)
      ]],
      confirm_password: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('new_password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    const uidb64 = this.route.snapshot.params['uidb64'];
    const token = this.route.snapshot.params['token'];
    let body = {
      "new_password": this.userPassword.get('new_password')?.value,
      "confirm_password": this.userPassword.get('confirm_password')?.value,
      "token": token,
      "uidb64": uidb64
    }
    this.userService.resetPasswordByToken(body, uidb64, token).subscribe(
      (data: any) => {
        this.validationSuccess = data.message;
      },
      (error) => {
        if (error.error[0] === 'Invalid token or user ID.') {
          this.validationError = "Link is invalid or expired. Please try again.";
        }
      }
    );
  }

}
