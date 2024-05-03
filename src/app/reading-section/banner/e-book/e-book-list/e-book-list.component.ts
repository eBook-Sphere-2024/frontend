import { Component, Input } from '@angular/core';
import { eBookItem } from '../../../../../shared/models/eBookItem';

@Component({
  selector: 'app-e-book-list',
  templateUrl: './e-book-list.component.html',
  styleUrl: './e-book-list.component.css'
})
export class EBookListComponent {
  @Input() eBooks : eBookItem[]=[];

}
