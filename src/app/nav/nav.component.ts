import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { EventService } from '../../shared/services/EventService';
import { User } from '../../shared/models/User';
import { UserServices } from '../User/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
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
  routerSubscription!: Subscription;

  constructor(
    private events: EventService,
    private router: Router,
    private userService: UserServices
  ) { }

  ngOnInit(): void {
    this.checkUserProfile();
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        let url = event.url;
        console.log('URL changed:', url);

        // Extract the portion after 'http://localhost:4200/'
        const baseUrl = 'http://localhost:4200/';
        if (url.startsWith(baseUrl)) {
          url = url.substring(baseUrl.length);
        }

        // Find the position of '#' and trim the URL if '#' exists
        const hashIndex = url.indexOf('#');
        let fragment = '';
        if (hashIndex !== -1) {
          fragment = url.substring(hashIndex + 1);
          url = url.substring(0, hashIndex);
        }

        console.log('Extracted URL:', url); // Output: Home or relevant part
        console.log('Fragment:', fragment); // Output: contactUs or relevant part

        let home = document.getElementById('home');
        let maker = document.getElementById('maker');
        let reading = document.getElementById('reading');
        let contact = document.getElementById('contact');
        let user = document.getElementById('user');

        // Remove active class from all elements with the same class .nav__link
        const navItems = document.querySelectorAll('.nav__link');
        navItems.forEach(item => {
          item.classList.remove('active-link');
        });

        // Add active class to current element based on the URL
        if (url.startsWith('/Home') && fragment === 'contactUs') {
          contact?.classList.add('active-link');
        } else if (url.startsWith('/Home')) {
          home?.classList.add('active-link');
        } else if (url.startsWith('/maker')) {
          maker?.classList.add('active-link');
        } else if (url.startsWith('/read') || url.startsWith('/search')) {
          reading?.classList.add('active-link');
        } else if (url.startsWith('/User') || url.startsWith('/authentication')) {
          user?.classList.add('active-link');
        }

        this.checkUserProfile();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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

  navigate(url: string, fragment: string = '') {
    let home = document.getElementById('home');
    let maker = document.getElementById('maker');
    let reading = document.getElementById('reading');
    let contact = document.getElementById('contact');
    let user = document.getElementById('user');
    //remove active class from all elementa they have same class .nav__link
    const navItems = document.querySelectorAll('.nav__link');
    navItems.forEach(item => {
      item.classList.remove('active-link');
    });
    //add active class to current element
    if (url === '/Home' && fragment === 'contactUs') {
      contact?.classList.add('active-link');
    } else if (url === '/Home') {
      home?.classList.add('active-link');
    } else if (url === '/maker/editor') {
      maker?.classList.add('active-link');
    } else if (url === '/reading') {
      reading?.classList.add('active-link');
    } else if (url === '/User/profile' || url === '/authentication') {
      user?.classList.add('active-link');
    } else {

    }
    this.router.navigate([url], { fragment }).then(() => {
      this.events.emitNavigation(url);
    });
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
        this.navigate('/Home', 'contactUs');
        break;
      case 'about us':
        this.navigate('/Home', 'aboutUs');
        break;
      case 'home':
        this.navigate('/Home');
        break;
      case 'search for a book':
        this.navigate('/reading');
        break;
      case 'related book':
        this.navigate('/reading');
        break;
      case 'books':
        this.navigate('/reading');
        break;
      case 'read books':
        this.navigate('/reading');
        break;
      case 'ebook maker':
        this.navigate('/maker/editor');
        break;
      case 'templates':
        this.navigate('/maker/templates');
        break;
      case 'sign in':
        this.navigate('/authentication');
        break;
      case 'sign up':
        this.navigate('/authentication');
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

  browseTo() {
    try {
      const currentUrl = this.router.url;
      console.log("Original URL:", currentUrl);
      const url = new URL(currentUrl, window.location.origin);
      const pathWithoutHash = url.pathname + url.search;
      console.log("Cleaned URL:", pathWithoutHash);
      if (pathWithoutHash.includes('/resetPassword'))
        return
      this.events.emit("openSigninDialog", pathWithoutHash);
    } catch (error) {
      console.error("Error capturing URL or emitting event:", error);
    }
  }
}
