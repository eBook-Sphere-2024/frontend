import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { UserServices } from '../user.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit{
  userProfile!: User;
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  constructor(private userService: UserServices) { }
  toggleVisibility() {
    this.nav.nativeElement.classList.toggle('hide');
    this.content.nativeElement.classList.toggle('expand');
  }
  ngOnInit(): void {
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
