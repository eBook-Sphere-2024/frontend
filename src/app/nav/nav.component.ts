import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  currentFragment: string = '';

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
        this.updateActiveLinkFromUrl(event.url);
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
          this.userProfile = null;
        }
      );
    } else {
      this.userProfile = null;
    }
  }

  navigate(url: string, fragment: string = ''): void {
    this.router.navigate([url], { fragment }).then(() => {
      this.events.emitNavigation(url);
    });
  }

  filterSearchItems(event: any): void {
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
  openEditor() {
    this.events.emit('openEditor', true);
    this.router.navigateByUrl('/maker/editor');
  }
  logout() {
    sessionStorage.clear();
    this.userProfile = null;
    this.router.navigate(['/']);
  }
  onSearchItemSelected(item: string): void {
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

    const searchClose = document.getElementById('search-close');
    if (searchClose) {
      searchClose.click();
    }
    this.searchQuery = '';
  }

  browseTo(): void {
    try {
      const currentUrl = this.router.url;
      const url = new URL(currentUrl, window.location.origin);
      const pathWithoutHash = url.pathname + url.search;
      if (pathWithoutHash.includes('/resetPassword')) return;
      this.events.emit('openSigninDialog', pathWithoutHash);
    } catch (error) {
      console.error('Error capturing URL or emitting event:', error);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const aboutUs = document.getElementById('aboutUs');
    const contactUs = document.getElementById('contactUs');

    if (!aboutUs || !contactUs) return;

    const aboutUsTop = aboutUs.getBoundingClientRect().top;
    const contactUsTop = contactUs.getBoundingClientRect().top;

    if (aboutUsTop <= 0 && contactUsTop > 0) {
      if (this.currentFragment !== 'aboutUs') {
        this.currentFragment = 'aboutUs';
        this.updateActiveLinkFromFragment('aboutUs');
      }
    } else if (contactUsTop <= 0) {
      if (this.currentFragment !== 'contactUs') {
        this.currentFragment = 'contactUs';
        this.updateActiveLinkFromFragment('contactUs');
      }
    } else {
      if (this.currentFragment !== '') {
        this.currentFragment = '';
        this.updateActiveLinkFromFragment('');
      }
    }
  }

  updateActiveLinkFromUrl(url: string): void {
    const baseUrl = 'http://localhost:4200';
    if (url.startsWith(baseUrl)) {
      url = url.substring(baseUrl.length);
    }

    const hashIndex = url.indexOf('#');
    let fragment = '';
    if (hashIndex !== -1) {
      fragment = url.substring(hashIndex + 1);
      url = url.substring(0, hashIndex);
    }

    this.updateActiveLink(url, fragment);
  }

  updateActiveLink(url: string, fragment: string = ''): void {
    let home = document.getElementById('home');
    let maker = document.getElementById('maker');
    let reading = document.getElementById('reading');
    let contact = document.getElementById('contact');
    let user = document.getElementById('user');

    const navItems = document.querySelectorAll('.nav__link');
    navItems.forEach(item => {
      item.classList.remove('active-link');
    });

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

    this.updateUrl(url, fragment);
  }

  updateActiveLinkFromFragment(fragment: string): void {
    let home = document.getElementById('home');
    let about = document.getElementById('about');
    let contact = document.getElementById('contact');

    const navItems = document.querySelectorAll('.nav__link');
    navItems.forEach(item => {
      item.classList.remove('active-link');
    });

    if (fragment === 'contactUs') {
      contact?.classList.add('active-link');
    } else if (fragment === 'aboutUs') {
      about?.classList.add('active-link');
    } else {
      home?.classList.add('active-link');
    }

    this.updateUrl('/Home', fragment);
  }

  updateUrl(url: string, fragment: string = ''): void {
    const baseUrl = 'http://localhost:4200';
    let fullUrl = baseUrl + url;
    if (fragment) {
      fullUrl += `#${fragment}`;
    }
    history.pushState(null, '', fullUrl);
  }
}
