import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { EventService } from '../../../shared/services/EventService';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  @Output() searchQuery = new EventEmitter<string>();
  @ViewChildren('bannerInput') bannerInputs!: QueryList<ElementRef<HTMLInputElement>>;
  query: FormControl = new FormControl();

  constructor(private events: EventService, private router: Router) { }

  ngOnInit(): void {
    this.startBannerTimer();
  }

  startBannerTimer(): void {
    setInterval(() => {
      const inputs: HTMLInputElement[] = this.bannerInputs.map(input => input.nativeElement);
      const checkedInput = inputs.find(input => input.checked);
      const currentIndex = inputs.indexOf(checkedInput!);
      const nextIndex = (currentIndex + 1) % inputs.length;
      inputs[nextIndex].checked = true;
    }, 5000);
  }
  search(event: Event) {
    event.preventDefault();
    const queryValue = this.query.value;
    if (queryValue && queryValue.trim().length > 0) {
      this.router.navigate(['/search'], { queryParams: { query: queryValue } });
    }
  }
}
