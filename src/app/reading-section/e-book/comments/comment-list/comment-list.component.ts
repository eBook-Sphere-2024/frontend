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
  rating: number = 0;

  commentForm = new FormGroup({
    formMessage: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private eBookService: EBookService, private userService: UserServices) { }

  ngOnInit() {
    this.getComments();
    this.getCurrentUser();
  }
  getComments() {
    this.eBookService.get_Comments(this.eBook.id.toString()).subscribe(
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
  addRatingEventListeners() {
    const stars = document.querySelectorAll('.rating .star') as NodeListOf<HTMLElement>;
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        this.setRating(index + 1);
      });
    });
  }

  setRating(rating: number) {
    this.rating = rating;
    const ratingInput = document.getElementById('ratingValue') as HTMLInputElement;
    ratingInput.value = rating.toString();

    const stars = document.querySelectorAll('.rating .star') as NodeListOf<HTMLElement>;
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }


}

