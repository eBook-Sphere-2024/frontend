import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EBookService } from '../../e-book.service';
import { User } from '../../../../../shared/models/User';
import { eBookItem } from '../../../../../shared/models/eBookItem';
import { Comment } from '../../../../../shared/models/Comment';
@Component({
  selector: 'app-add-comment-form',
  templateUrl: './add-comment-form.component.html',
  styleUrl: './add-comment-form.component.css'
})
export class AddCommentFormComponent {
  @Input() userProfile!: User;
  @Input() eBook!: eBookItem;
  @Input() comment!: Comment | null;
  commentForm = new FormGroup({
    formMessage: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private eBookService: EBookService) { }
  submitComment(): void {
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('formMessage')?.value ?? '';

      if (this.comment == null) {
        this.eBookService.addComment(this.userProfile.id.toString(), this.eBook.id.toString(), commentText).subscribe(
          response => {
            window.location.reload();
          },
          error => {
            console.error('Add comment failed:', error);
          }
        );
      } else {
        this.eBookService.addComment(this.userProfile.id.toString(), this.comment.ebook.id.toString(), commentText, this.comment).subscribe(
          response => {
            window.location.reload();
          },
          error => {
            console.error('Add comment failed:', error);
          }
        );
      }
    }
  }

}