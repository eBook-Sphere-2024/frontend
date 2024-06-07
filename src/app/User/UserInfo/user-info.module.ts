import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatedBooksComponent } from './created-books/created-books.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    UserInfoComponent,
    ProfileComponent,
    CreatedBooksComponent,
    ChangePasswordComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports:[
    UserInfoComponent
  ]
})
export class UserInfoModule { }
