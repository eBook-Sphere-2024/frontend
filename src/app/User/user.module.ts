import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserComponent } from './user.component';
import { UserInfoModule } from './UserInfo/user-info.module';



@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    UserInfoModule
  ],
  exports:[
    UserComponent
  ]
})
export class UserModule { }
