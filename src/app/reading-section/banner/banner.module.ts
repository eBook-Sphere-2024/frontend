import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerComponent } from './banner.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { EBookItemComponent } from '../e-book/e-book-item/e-book-item.component';
@NgModule({
  declarations: [
    BannerComponent,
    SearchComponent,
    
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
