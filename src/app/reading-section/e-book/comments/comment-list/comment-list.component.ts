import { Component, Input, OnInit } from '@angular/core';
import { EBookService } from '../../e-book.service';
import { Comment } from '../../../../../shared/models/Comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit {
  @Input() eBook: any;
  comments: Comment[] = [];
  constructor(private eBookService: EBookService) { }

  ngOnInit() {
    this.eBookService.get_Comments().subscribe(
      (data: any) => {
        this.comments = data;
        for (let i = 0; i < this.comments.length; i++) {
          this.eBookService.get_user_profile(this.comments[i].user.id.toString()).subscribe(
            (data: any) => {
              this.comments[i].user.avatar = data.profile_image;
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
