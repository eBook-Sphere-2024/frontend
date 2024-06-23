import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../shared/services/EventService';
import { User } from '../../shared/models/User';
import { UserServices } from '../User/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userProfile!: User | null;
  searchItems: string[] = [
    'Contact Us',
    'About Us',
    'Home',
    'Search for a book',
    'Related Book',
    'Books',
    'Read Books',
    'eBook Maker',
    'Templates',
    'Sign In',
    'Sign Up'
  ];
  filteredItems: string[] = [];
  searchQuery: string = '';

  constructor(
    private events: EventService,
    private router: Router,
    private userService: UserServices
  ) {}

  ngOnInit(): void {
    this.checkUserProfile();
  }

  checkUserProfile(): void {
    const token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
        },
        (error: any) => {
          console.log(error.message);
          this.userProfile = null;
        }
      );
    } else {
      this.userProfile = null;
    }
  }

  openEditor() {
    this.events.emit('openEditor', true);
    this.router.navigateByUrl('/maker/editor');
  }

  logout() {
    sessionStorage.clear();
    this.userProfile = null;
    this.router.navigate(['/']);
  }

  filterSearchItems(event: any) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    if (query.trim() !== '') {
      this.filteredItems = this.searchItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredItems = [];
    }
  }

  onSearchItemSelected(item: string) {
    this.searchQuery = '';
    this.filteredItems = [];

    switch (item.toLowerCase()) {
      case 'contact us':
        this.router.navigate(['/Home'], { fragment: 'contactUs' });
        break;
      case 'about us':
        this.router.navigate(['/Home'], { fragment: 'aboutUs' });
        break;
      case 'home':
        this.router.navigate(['/Home']);
        break;
      case 'Search for a book':
        this.router.navigate(['/reading']);
        break;
      case 'related book':
        this.router.navigate(['/reading']);
        break;
      case 'books':
        this.router.navigate(['/reading']);
        break;
      case 'read books':
        this.router.navigate(['/reading']);
        break;
      case 'ebook maker':
        this.router.navigate(['/maker/editor']);
        break;
      case 'templates':
        this.router.navigate(['/maker/templates']);
        break;
      case 'sign in':
        this.router.navigate(['/authentication']);
        break;
      case 'sign up':
        this.router.navigate(['/authentication']);
        break;
      default:
        break;
    }
    let searchClose = document.getElementById('search-close');
    if (searchClose) {
      searchClose.click();
    }
    this.searchQuery = '';
  }
}
