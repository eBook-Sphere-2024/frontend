import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'] 
})
export class ResetPasswordComponent {
  userPassword: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.userPassword = this.fb.group({
      new_password: ['', [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), Validators.minLength(8)]],
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
}
