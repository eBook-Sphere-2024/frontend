import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EBookItemComponent } from './e-book-item/e-book-item.component';
import { EBookListComponent } from './e-book-list/e-book-list.component';
import { EBookFilterComponent } from './e-book-filter/e-book-filter.component';
import { EBookComponent } from './e-book.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EBookItemComponent,
    EBookListComponent,
    EBookFilterComponent,
    EBookComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    EBookComponent,
  ]
})
export class EBookModule { }
