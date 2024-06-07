import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { ReadingSectionModule } from './reading-section/reading-section.module';
import { UserModule } from './User/user.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReadingSectionModule,
    FlexLayoutModule,
    UserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
