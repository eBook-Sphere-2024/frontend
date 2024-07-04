import { Component, Input, OnInit } from '@angular/core';
import { EBookService } from '../../e-book.service';
import { Comment } from '../../../../../shared/models/Comment';
import { UserServices } from '../../../../User/user.service';
import { User } from '../../../../../shared/models/User';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'] 
})
export class CommentListComponent implements OnInit {
  @Input() eBook: any;
  comments: Comment[] = [];
  userProfile!: User;
  rating: number = 0;
  rated: number = 0;
  commentForm = new FormGroup({
    formMessage: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private eBookService: EBookService, private userService: UserServices, private router: Router) { }

  ngOnInit() {
    this.getComments();
    this.getCurrentUser();
    this.addRatingEventListeners();
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
          );
        }
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }

  getCurrentUser() {
    let token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              this.userProfile.avatar = data.profile_image;
            },
            (error) => {
              console.error('Error fetching user profile:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }

  addRatingEventListeners() {
    const stars = document.querySelectorAll('.rating .star') as NodeListOf<HTMLElement>;
    stars.forEach((star, index) => {
      star.addEventListener('mouseover', () => {
        this.setRating(index + 1, "hover");
      })
      star.addEventListener('mouseout', () => {

        this.setRating(this.rated, "hover");
      })
      star.addEventListener('click', () => {
        if (this.userProfile) {
          this.setRating(index + 1, "click");
          this.rated = index + 1;
        } else {
          this.opensigninDialog();
        }
      });
    });
  }

  setRating(rating: number, action: string) {
    this.rating = rating;
    const ratingInput = document.getElementById('ratingValue') as HTMLInputElement;
    ratingInput.value = rating.toString();

    const stars = document.querySelectorAll('.rating .star') as NodeListOf<HTMLElement>;
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
    if (action === "click") {
      this.addRate();
    }
  }
  addRate() {
    let token = sessionStorage.getItem('Token');
    if (token) {
      this.eBookService.rate_ebook(this.eBook.id.toString(), this.userProfile.id.toString(), this.rating).subscribe(
        (data: any) => {
        },
        (error: any) => {
          alert(error.message);
        }
      );
    }
  }

  opensigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.showModal();
    const okButton = dialog.querySelector('.ok') as HTMLButtonElement;
    okButton.addEventListener('click', () => {
      this.router.navigate(['/authentication']);
    });
  }

  closesigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.close();
  }
}
