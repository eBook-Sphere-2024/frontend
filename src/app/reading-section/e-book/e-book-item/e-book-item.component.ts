import { Component, Input } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';

@Component({
  selector: 'app-e-book-item',
  templateUrl: './e-book-item.component.html',
  styleUrl: './e-book-item.component.css'
})
export class EBookItemComponent {
  @Input() eBook!: eBookItem;

}
