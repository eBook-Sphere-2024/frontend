import { Component, Input, OnInit } from '@angular/core';
import { EBookService } from '../e-book.service';
import { Comments } from '../../../../shared/models/Comments';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit {
  @Input() eBook: any;
  comments: Comments[] = [];
  constructor(private eBookService: EBookService) { }

  ngOnInit() {
    const id = this.eBook.id;
    this.eBookService.get_Comments(id).subscribe(
      (data: any) => {
        this.comments = data;
        console.log(this.comments);
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }
}
