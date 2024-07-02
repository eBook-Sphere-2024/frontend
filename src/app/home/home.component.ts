import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import 'swiper/css/bundle';
import { UserServices } from '../User/user.service';
import { EventService } from '../../shared/services/EventService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  searchContent = document.getElementById("search-content")
  searchButton = document.getElementById("search-button")
  searchClose = document.getElementById("search-close")

  sendFail: boolean = false;
  sendSuccefully: boolean = false;
  failMessage: string = '';
  ContactData: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserServices,
    private events: EventService,
    private router: Router,
  ) {
    /*=============== SEARCH ===============*/

    /*===== SEARCH SHOW =====*/
    // Validate if constant exists
    if (this.searchButton) {
      this.searchButton.addEventListener("click", () => {
        this.searchContent?.classList.add("show-search");
      });
    }

    /*===== SEARCH CLOSE =====*/
    // Validate if constant exists
    if (this.searchClose) {
      this.searchClose.addEventListener("click", () => {
        this.searchContent?.classList.remove("show-search");
      });
    }

    this.ContactData = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

  }

  ngAfterViewInit() {
    console.log('Initializing Swiper');
    const swiperHome = new Swiper('.home__swiper', {
      loop: true,
      spaceBetween: -24,
      grabCursor: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      autoplay: {
        delay: 300,
        disableOnInteraction: false,
      },
      breakpoints: {
        1220: {
          spaceBetween: -32,
        },
      },
    });
    console.log('Swiper initialized:', swiperHome);
  }
  sendMail() {
    this.userService.ContactMail(this.ContactData.value).subscribe(
      (data: any) => {
        console.log(data);
        this.sendFail = false;
        this.sendSuccefully = true;
        this.failMessage = '';
      },
      (error: any) => {
        console.log(error);
        this.sendSuccefully = false;
        this.sendFail = true;
        this.failMessage = error.error.email[0];

      }
    );
  }
  openEditor() {
    this.events.emit('openEditor', true);
    this.router.navigateByUrl('/maker/editor');
  }
}
