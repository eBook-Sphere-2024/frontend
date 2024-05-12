import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  toggleVisibility() {
    this.nav.nativeElement.classList.toggle('hide');
    this.content.nativeElement.classList.toggle('expand');
  }
}
