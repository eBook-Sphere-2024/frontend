import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { User } from '../../../../shared/models/User';
import { UserServices } from '../../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserServices) { }
  userProfile!: User;

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
  userData= new FormGroup({
    first_name: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
    last_name: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
    username: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]),
  })
}
