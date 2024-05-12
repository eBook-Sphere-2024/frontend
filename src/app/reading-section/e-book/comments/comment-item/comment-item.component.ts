import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../../../shared/models/Comment';
import { EBookService } from '../../e-book.service';
import { UserServices } from '../../../../User/user.service';
import { User } from '../../../../../shared/models/User';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css'
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: Comment
  replies!: Comment[]
  userProfile!: User;

  constructor(private eBookService: EBookService, private userService: UserServices) {
  }

  ngOnInit(): void {

    this.eBookService.get_comment_replies(this.comment.id.toString(), this.comment.ebook.id.toString()).subscribe(
      (data: any) => {
        this.replies = data;
        for (let i = 0; i < this.replies.length; i++) {
          this.userService.get_user_profile(this.replies[i].user.id.toString()).subscribe(
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

    this.getCurrentUser()
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

}
