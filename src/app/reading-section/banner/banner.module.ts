import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './banner.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    BannerComponent
  ]
})
export class BannerModule { }
