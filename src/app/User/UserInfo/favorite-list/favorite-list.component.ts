import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../user.service';
import { User } from '../../../../shared/models/User';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../../../reading-section/e-book/e-book.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {
  eBookFav: any[] = [];
  eBooks: eBookItem[] = [];
  readerAnalysis: any[] = [];
  userProfile!: User;
  HighestProgess: any[] = [];
  userAnalysis: any[] = [];
  constructor(private userService: UserServices, private bookService: EBookService) { }

  ngOnInit(): void {
    let token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              this.userProfile.avatar = data.profile_image;
              this.userService.getFavoriteBooksForUser(this.userProfile.id).subscribe(
                (data: any) => {
                  this.eBookFav = data;
                  // Search for bookFav at eBooks and store them in the new list
                  for (let i = 0; i < this.eBookFav.length; i++) {
                    this.bookService.getBookById(this.eBookFav[i].ebook).subscribe(
                      (ebook: any) => {
                        this.userService.getSpecificReaderAnalysis(this.userProfile.id.toString(), ebook.id.toString()).subscribe(
                          (analysis: any) => {
                            ebook.highestProgess = analysis.highest_progress;
                            ebook.totalPages = analysis.totalPages;
                            this.eBooks.push(ebook);
                          },
                          (error) => {

                            this.eBooks.push(ebook);
                          }
                        )
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
        window.location.reload();
      },
      (error: any) => {
        console.error('Error removing from favorites:', error);
      }
    );
  }
  calculateProgress(eBook: any) {
    let progress = (eBook.highestProgess / eBook.totalPages) * 100;
    progress = progress ? progress : 0;
    return progress.toFixed(0) ? progress.toFixed(0) : '0';
  }
  getProgressColor(progress: any) {
    if (progress > 99) {
      return 'limegreen';
    } else if (progress > 0) {
      return 'orange';
    } else
      return '#eeefef';
  }
}
