import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddCommentFormComponent } from './add-comment-form/add-comment-form.component';

@NgModule({
  declarations: [
    CommentListComponent,
    CommentItemComponent,
    AddCommentFormComponent
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
