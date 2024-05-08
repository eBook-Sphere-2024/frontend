import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../../../shared/models/Comment';
import { EBookService } from '../../e-book.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css'
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: Comment
  replies!: Comment[]

  constructor(private eBookService: EBookService) {
  }

  ngOnInit(): void {

    this.eBookService.get_comment_replies(this.comment.id.toString(), this.comment.ebook.id.toString()).subscribe(
      (data: any) => {
        this.replies = data;
        for (let i = 0; i < this.replies.length; i++) {
          this.eBookService.get_user_profile(this.replies[i].user.id.toString()).subscribe(
            (data: any) => {
              this.replies[i].user.avatar = data.profile_image;
            },
            (error: any) => {
              alert(error.message);
            }
          )
        }
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }

}
