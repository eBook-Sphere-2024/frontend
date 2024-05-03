import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EBookModule } from './reading-section/banner/e-book/e-book.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EBookModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
