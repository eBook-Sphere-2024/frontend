import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { UserServices } from '../user.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
  userProfile!: User;
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  showDialog: boolean = false;

  constructor(private userService: UserServices) { }
  toggleVisibility() {
    this.nav.nativeElement.classList.toggle('hide');
    this.content.nativeElement.classList.toggle('expand');
  }
  ngOnInit(): void {
    let token = sessionStorage.getItem('Token');
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
        },
        (error) => {
          // Handle error if any
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }
  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadFile(input);
  }
  uploadFile(fileInput: HTMLInputElement): void {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.showDialog = true;
      this.userService.uploadAvatar(this.userProfile.id, file).subscribe(
        (response: any) => {
          console.log('Avatar uploaded successfully:', response);
          // Update the user profile avatar with the new one
          this.userProfile.avatar = response.avatarUrl; // Adjust according to your response structure
          this.showDialog = false;
          window.location.reload();
        },
        (error: any) => {
          console.error('Error uploading avatar:', error);
        }
      );
    }
  }

}
