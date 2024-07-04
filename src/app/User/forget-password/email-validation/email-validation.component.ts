import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServices } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.component.html',
  styleUrl: './email-validation.component.css'
})
export class EmailValidationComponent {
  emailValidationForm: FormGroup
  validationError: string = ''
  validationSuccess: string = ''
  constructor(private fb: FormBuilder, private userService: UserServices, private router: Router) {
    this.emailValidationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }
  onSubmit() {
    this.userService.reset_password_BY_email(this.emailValidationForm.value).subscribe(
      (data: any) => {
        this.validationSuccess = data.message;
      },
      (error) => {
        if (error.error.email[0] === "This field may not be blank.")
          this.validationError = "email is required";
        else
          this.validationError = error.error.email[0];
      }
    );
  }

}
