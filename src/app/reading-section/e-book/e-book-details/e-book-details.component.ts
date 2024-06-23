import { Component, OnInit, Input } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserServices } from '../../../User/user.service';
import { User } from '../../../../shared/models/User';
import { EventService } from '../../../../shared/services/EventService';

@Component({
  selector: 'app-e-book-details',
  templateUrl: './e-book-details.component.html',
  styleUrls: ['./e-book-details.component.css']
})

export class EBookDetailsComponent implements OnInit {
  eBookItem!: eBookItem;
  userProfile!: User;
  isFavourite: boolean = false;
  stars = [1, 2, 3, 4, 5];
  constructor(private route: ActivatedRoute, private eBookService: EBookService, private Router: Router, private userService: UserServices, private events: EventService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.eBookService.getBookById(id).subscribe(
          (event: any) => {
            this.eBookItem = event;
            this.eBookService.getBookRating(id).subscribe(
              (event: any) => {
                console.log(event);
                this.eBookItem.rate = event;
              },
              (error: any) => {
                console.error('Error fetching eBook rating:', error);
              }
            )
          },
          (error: any) => {
            console.error('Error fetching eBook details:', error);
          }
        );
      }
    });
    let token = sessionStorage.getItem('Token');
    console.log("token", token);
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (data: any) => {
              this.userProfile.avatar = data.profile_image;
              this.userService.getFavoriteBooksForUser(this.userProfile.id).subscribe(
                (data: any) => {
                  if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                      if (data[i].ebook == this.eBookItem.id) {
                        this.isFavourite = true;
                        console.log(this.isFavourite);
                        break;
                      }
                    }
                  } else {
                    this.isFavourite = false;
                  }
                },
                (error) => {
                  console.error('Error fetching favorite books:', error);
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

  goBack() {
    //go to e-book component
    this.Router.navigate(['reading']);
  }
  readBook() {
    if (this.userProfile) {
      this.events.emit('pdfVieweruser', this.userProfile);
      this.userService.getSpecificReaderAnalysis(this.userProfile.id.toString(), this.eBookItem.id.toString()).subscribe(
        (data: any) => {
          this.events.emit('currentPage', data.currentPgae);
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      )
      this.Router.navigate(['/read', this.eBookItem.id]);
    }
    else {
      this.opensigninDialog();
    }
  }

  download() {
    if (this.userProfile) {
      // Assuming the fileId is already fetched and stored in eBookItem.content
      this.eBookService.download_eBook(this.eBookItem.content).subscribe(
        (data: any) => {
          // Assuming the server response contains the download link and file name
          const downloadLink = data;
          const fileName = this.eBookItem.title + ".pdf";

          // Create a link element
          const link = document.createElement("a");
          link.href = downloadLink;
          link.download = fileName; // Set the desired file name

          // Programmatically click the link to initiate the download
          link.click();
        },
        (error: any) => {
          console.error('Error downloading eBook:', error);
        }
      );
    } else {
      this.opensigninDialog();
    }

  }
  favourite() {
    if (!this.userProfile) {
      this.opensigninDialog();
      return;
    }
    let data = {
      user_id: this.userProfile.id,
      ebook_id: this.eBookItem.id
    }
    if (this.isFavourite) {//remove from favorite
      this.userService.RemoveFromFavorites(data).subscribe(
        (data: any) => {
          this.isFavourite = false;
        },
        (error: any) => {
          console.error('Error removing from favorites:', error);
        }
      );
    } else { //add to favorite

      this.userService.AddToFavorites(data).subscribe(
        (data: any) => {
          this.isFavourite = true;
        },
        (error: any) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }
  opensigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.showModal();
    const okButton = dialog.querySelector('.ok') as HTMLButtonElement;
    okButton.addEventListener('click', () => {
      this.events.emit('openSigninDialog', '/reading/ebooks/' + this.eBookItem.id);
      this.Router.navigate(['/authentication']);
    });
  }

  closesigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.close();
  }
}