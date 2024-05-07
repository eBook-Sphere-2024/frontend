import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EBookItemComponent } from './e-book-item/e-book-item.component';
import { EBookListComponent } from './e-book-list/e-book-list.component';
import { EBookFilterComponent } from './e-book-filter/e-book-filter.component';
import { EBookComponent } from './e-book.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EBookDetailsComponent } from './e-book-details/e-book-details.component';
import { RouterModule } from '@angular/router';
import { CommentListComponent } from './comment-list/comment-list.component';


@NgModule({
  declarations: [
    EBookItemComponent,
    EBookListComponent,
    EBookFilterComponent,
    EBookComponent,
    EBookDetailsComponent,
    CommentListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    EBookComponent,
  ]
})
export class EBookModule { }
