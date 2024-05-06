import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EBookModule } from './reading-section/e-book/e-book.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { ReadingSectionModule } from './reading-section/reading-section.module';
import { BannerComponent } from './reading-section/banner/banner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    EBookModule,
    FlexLayoutModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
