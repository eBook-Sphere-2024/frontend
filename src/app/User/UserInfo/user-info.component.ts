import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserServices } from '../user.service';
import { User } from '../../../shared/models/User';
import { EventService } from '../../../shared/services/EventService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userProfile!: User;
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  showDialog: boolean = false;

  constructor(
    private userService: UserServices,
    private events: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
          this.userService.get_user_profile(this.userProfile.id.toString()).subscribe(
            (profileData: any) => {
              this.userProfile.avatar = profileData.profile_image;
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
    } else {
      const signinDialogg = document.getElementById('signinDialogg');
      if (signinDialogg) {
        signinDialogg.style.display = 'block';
      }
    }
  }

  toggleVisibility() {
    this.nav.nativeElement.classList.toggle('hide');
    this.content.nativeElement.classList.toggle('expand');
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
          this.userProfile.avatar = response.avatarUrl;
          this.showDialog = false;
          window.location.reload();
        },
        (error: any) => {
          console.error('Error uploading avatar:', error);
        }
      );
    }
  }

  goToSign() {
    const currentUrl = this.router.url;
    this.events.emit("openSigninDialog", currentUrl);
    this.router.navigate(['/authentication']);
  }

  removeProfile() {
    this.showDialog = true;
    this.userService.removeAvatar(this.userProfile.id).subscribe(
      (data: any) => {
        this.showDialog = false;
        window.location.reload();
      },
      (error: any) => {
        console.error('Error removing avatar:', error);
      }
    );
  }
}