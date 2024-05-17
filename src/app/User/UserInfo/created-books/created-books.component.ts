import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../user.service';
import { User } from '../../../../shared/models/User';
import { eBookItem } from '../../../../shared/models/eBookItem';

@Component({
  selector: 'app-created-books',
  templateUrl: './created-books.component.html',
  styleUrl: './created-books.component.css'
})
export class CreatedBooksComponent implements OnInit {

  eBooks: eBookItem[] = [];
  userProfile!: User;
  constructor(private userService: UserServices) { }

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
              this.userService.get_createdBooks(this.userProfile.id.toString()).subscribe(
                (data: any) => {
                  this.eBooks = data;
                  console.log(this.eBooks);
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
}
