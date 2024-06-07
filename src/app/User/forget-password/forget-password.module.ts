import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailValidationComponent } from './email-validation/email-validation.component';
import { ForgetPasswordComponent } from './forget-password.component';



@NgModule({
  declarations: [
  ForgetPasswordComponent,
   ResetPasswordComponent,
   EmailValidationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ForgetPasswordComponent
  ]
})
export class ForgetPasswordModule { }
