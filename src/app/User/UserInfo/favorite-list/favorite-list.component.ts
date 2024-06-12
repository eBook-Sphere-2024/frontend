import { Component,OnInit } from '@angular/core';
import { UserServices } from '../../user.service';
import { User } from '../../../../shared/models/User';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../../../reading-section/e-book/e-book.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {
  constructor(private userService: UserServices,private bookService: EBookService) { }
  eBookFav: any[] = [];
  eBooks: eBookItem[] = [];
  userProfile!: User;
  ngOnInit(): void {
    let token = sessionStorage.getItem('Token');
    console.log(token);
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              this.userProfile.avatar = data.profile_image;
              console.log(this.userProfile);
              console.log("ID: ",this.userProfile.id);
              this.userService.getFavoriteBooksForUser(this.userProfile.id).subscribe(
                (data: any) => {
                  this.eBookFav = data;
                  console.log(this.eBookFav);
                    // search for bookFav at ebooks and store them in the new list
                  for (let i = 0; i < this.eBookFav.length; i++) {
                    this.bookService.getBookById(this.eBookFav[i].ebook).subscribe(
                      (data: any) => {
                        this.eBooks.push(data);
                      },
                      (error) => {
                        console.error('Error fetching book:', error);
                      }
                    );
                  }
                },
                (error) => {
                  console.error('Error fetching created books:', error);
                }
              );
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
  removeFavorite(eBook: any) {
    let data = {
      ebook_id: eBook.id,
      user_id: this.userProfile.id
    };
    this.userService.RemoveFromFavorites(data).subscribe(
      (data: any) => {
        console.log(data);
        window.location.reload();
      },
      (error: any) => {
        console.error('Error removing from favorites:', error);
      }
    );
  }
}
