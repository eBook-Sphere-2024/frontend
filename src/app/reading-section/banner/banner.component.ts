import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { EventService } from '../../../shared/services/EventService';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  @Output() searchQuery = new EventEmitter<string>();
  @ViewChildren('bannerInput') bannerInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private events: EventService) { }

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
  search(event: Event, query: string) {
    event.preventDefault(); // Prevent form submission
    this.events.emit('search', query);
  }
}
