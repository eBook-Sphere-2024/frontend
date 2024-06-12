import { Component, Input } from '@angular/core';
import { Template } from '../../../../shared/models/Template';
import { EventService } from '../../../../shared/services/EventService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-item',
  templateUrl: './template-item.component.html',
  styleUrls: ['./template-item.component.css']
})
export class TemplateItemComponent {
  @Input() template!: Template;

  constructor(private events: EventService, private router: Router) { }

  editTemplate() {
    this.events.emit('editTemplate', this.template);
    this.router.navigate(['/maker/editor']);
  }
}
