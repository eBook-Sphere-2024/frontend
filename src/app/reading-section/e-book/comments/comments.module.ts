import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommentListComponent,
    CommentItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommentListComponent
  ]
})
export class CommentsModule { }
