import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { UserServices } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile!: User;
  userData: FormGroup;
  userUpdate!: User;
  constructor(
    private userService: UserServices,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.userData = this.fb.group({ // Initialize the FormGroup
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

  }
  ngOnInit(): void {
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
  updateProfile() {
      this.userUpdate.id= this.userProfile.id,
      this.userUpdate.first_name= this.userData.value.first_name,
      this.userUpdate.last_name=this.userData.value.last_name,
      this.userUpdate.username= this.userData.value.username,
      this.userUpdate.email=this.userData.value.email
    this.userService.update_user_profile(this.userUpdate).subscribe(
      (data: any) => {
        console.log("response: ",data);
      },
      (error) => {
        console.error('Error updating user profile:', error);
      }
    );
  }  
}
