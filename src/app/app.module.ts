import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { ReadingSectionModule } from './reading-section/reading-section.module';
import { AuthenticationModule } from './User/authentication/authentication.module';
import { ProfileModule } from './User/UserInfo/profile/profile.module';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReadingSectionModule,
    FlexLayoutModule,
    AuthenticationModule,
    ProfileModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
