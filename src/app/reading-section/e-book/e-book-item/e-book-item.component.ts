import { Component, Input, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { UserServices } from '../../../User/user.service';
import { User } from '../../../../shared/models/User';

@Component({
  selector: 'app-e-book-item',
  templateUrl: './e-book-item.component.html',
  styleUrl: './e-book-item.component.css'
})
export class EBookItemComponent implements OnInit {
  @Input() eBook!: eBookItem;
  userProfile!: User;
  constructor(private userService: UserServices,) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;

          this.userService.getSpecificReaderAnalysis(this.userProfile.id.toString(), this.eBook.id.toString()).subscribe(
            (analysisData: any) => {
              this.eBook.highestProgess = analysisData.highest_progress;
            },
            (error) => {
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


