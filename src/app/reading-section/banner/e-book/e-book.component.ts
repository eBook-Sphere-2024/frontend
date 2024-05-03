import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from './e-book.service';
import { EventService } from '../../../../shared/services/EventService';

@Component({
  selector: 'app-e-book',
  templateUrl: './e-book.component.html',
  styleUrl: './e-book.component.css'
})
export class EBookComponent {
  [x: string]: any;

  constructor(events: EventService, private eBookService: EBookService) { }
  eBookItems: eBookItem[] = [];
  name: string = "";
  ngOnInit(): void {
    this.eBookService.getBooks().subscribe((data: any) => {
      this.eBookItems = data;
    },
      (error: any) => alert(error.message)
    )
  }
}
