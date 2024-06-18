import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReadingSectionComponent } from './reading-section.component';
import { EBookModule } from './e-book/e-book.module';
import { BannerModule } from './banner/banner.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    ReadingSectionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EBookModule,
    BannerModule,
    FormsModule,
    NgxExtendedPdfViewerModule
  ]
})
export class ReadingSectionModule { }
