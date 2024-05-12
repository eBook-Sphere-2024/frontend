import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { User } from '../../../../../shared/models/User';
import { UserServices } from '../../../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  userProfile!: User;

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
