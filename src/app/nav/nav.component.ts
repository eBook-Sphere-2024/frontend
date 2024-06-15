import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../shared/services/EventService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(private events: EventService, private router: Router) { }

  openEditor() {
    this.events.emit('openEditor', true);
    this.router.navigateByUrl('/maker/editor');
  }

}
