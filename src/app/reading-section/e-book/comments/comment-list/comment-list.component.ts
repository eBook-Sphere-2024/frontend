import { Component, Input, OnInit } from '@angular/core';
import { EBookService } from '../../e-book.service';
import { Comment } from '../../../../../shared/models/Comment';
import { UserServices } from '../../../../User/user.service';
import { User } from '../../../../../shared/models/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit {
  @Input() eBook: any;
  comments: Comment[] = [];
  userProfile!: User;

  commentForm = new FormGroup({
    formMessage: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private eBookService: EBookService, private userService: UserServices) { }

  ngOnInit() {
    this.getComments();
    this.getCurrentUser();
  }
  getComments() {
    this.eBookService.get_Comments().subscribe(
      (data: any) => {
        this.comments = data;
        for (let i = 0; i < this.comments.length; i++) {
          this.userService.get_user_profile(this.comments[i].user.id.toString()).subscribe(
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
  getCurrentUser() {
    let token = sessionStorage.getItem('Token');
    console.log(token);
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          // Assign the received user profile data to userProfileData
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              // Assign the received user profile data to userProfileData
              this.userProfile.avatar = data.profile_image;
            },
            (error) => {
              // Handle error if any
              console.error('Error fetching user profile:', error);
            }
          )
          console.log(this.userProfile);
        },
        (error) => {
          // Handle error if any
          console.error('Error fetching user profile:', error);
        }
      );

    }
  }
  submitComment() {
    if (this.commentForm.valid) {
      const commentText = this.commentForm.get('formMessage')?.value ?? '';
      this.eBookService.addComment(this.userProfile.id.toString(), this.eBook.id.toString(), commentText).subscribe(
        response => {
          console.log('Add comment successful:', response);
        },
        error => {
          console.error('Add comment failed:', error);
          // Handle registration failure here
        }
      );
      this.commentForm.reset();
      this.getComments()
    }
  }
}

