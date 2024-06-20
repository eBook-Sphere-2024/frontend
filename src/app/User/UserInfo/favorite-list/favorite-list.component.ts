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
  userAnalysis:any[]=[];
  constructor(private userService: UserServices, private bookService: EBookService) {}

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
              console.log("ID: ", this.userProfile.id);
              this.userService.getFavoriteBooksForUser(this.userProfile.id).subscribe(
                (data: any) => {
                  this.eBookFav = data;
                  console.log(this.eBookFav);
                  // Search for bookFav at eBooks and store them in the new list
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

    // Fetch reader analysis data
    this.userService.getReaderAnalysis().subscribe(
      (data: any) => {
        this.readerAnalysis = data;
        console.log("Reader Analysis: ", this.readerAnalysis);
        
        // Find reader analysis for the current user
        this.userAnalysis = this.readerAnalysis.find(entry => entry.user === this.userProfile.id);
        
        if (this.userAnalysis.length>0) {
          // Update eBooks with highest_progress attribute
          this.eBooks.forEach(eBook => {
            this.getHighestProgress(eBook.id).then(progress => {
              this.HighestProgess.push({ book: eBook.id, progress: progress });
            });
          });
        }
      },
      (error) => {
        console.error('Error fetching reader analysis:', error);
      }
    );
  }

  async getHighestProgress(bookId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        console.log("HighestProgess: ",this.HighestProgess);
        const entry = this.HighestProgess.find(entry => entry.book === bookId);
        resolve(entry ? entry.progress : 0);
      }, 50000); // Simulating delay, replace with actual async operation
    });
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
