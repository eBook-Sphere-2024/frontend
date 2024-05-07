import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReadingSectionComponent } from './reading-section.component';
import { BannerModule } from './banner/banner.module';
import { EBookModule } from './e-book/e-book.module';


@NgModule({
  declarations: [
    ReadingSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BannerModule,
    EBookModule,
    FormsModule
  ]
})
export class ReadingSectionModule { }
