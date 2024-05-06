import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  @ViewChildren('bannerInput') bannerInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor() { }

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
}
