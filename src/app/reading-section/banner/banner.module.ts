import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './banner.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [
    BannerComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  exports: [
    BannerComponent
  ]
})
export class BannerModule { }
