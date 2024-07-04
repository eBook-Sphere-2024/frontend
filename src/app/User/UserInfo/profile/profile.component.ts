import { Component, OnInit } from '@angular/core';
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
  username_fail: string = '';
  changeFail: boolean = false;
  changeSuccefully: boolean = false;
  failMessage: string = '';
  constructor(
    private userService: UserServices,
    private fb: FormBuilder
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

              // Set form values here, inside the subscription block
              this.userData.get('first_name')?.setValue(this.userProfile.first_name);
              this.userData.get('last_name')?.setValue(this.userProfile.last_name);
              this.userData.get('username')?.setValue(this.userProfile.username);
              this.userData.get('email')?.setValue(this.userProfile.email);
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
    this.userUpdate = {
      id: this.userProfile.id,
      first_name: this.userData.get('first_name')?.value,
      last_name: this.userData.get('last_name')?.value,
      username: this.userData.get('username')?.value,
      email: this.userData.get('email')?.value,
      password: this.userProfile.password
    }
    this.userService.update_user_profile(this.userUpdate).subscribe(
      (data: any) => {
        this.changeSuccefully = true
        this.changeFail = false
        this.userProfile = data;
        this.username_fail = '';
      },
      error => {
        if (error.status == 400 && error.error.message == 'Username already exists') {
          this.username_fail = 'Username already exists'
          this.failMessage = 'Username already exists';
        }else{
          this.failMessage = error.error.errors.non_field_errors[0];
        }
        this.changeFail = true
        this.changeSuccefully = false
        
      }
    );
  }
}
