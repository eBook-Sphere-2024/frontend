import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../shared/models/eBookItem';
import { EBookService } from './e-book.service';
import { EventService } from '../../../shared/services/EventService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-e-book',
  templateUrl: './e-book.component.html',
  styleUrls: ['./e-book.component.css']
})
export class EBookComponent implements OnInit {
  category: string = "";
  eBookItems: eBookItem[] = [];
  private filterReceived: boolean = false;

  constructor(private events: EventService, private eBookService: EBookService) { }

  ngOnInit(): void {
    this.events.listen('filter', (eBookItem: any) => {
      this.eBookItems = eBookItem;
      this.filterReceived = true;
    });

    // Call loadBooks if filter event is not yet received after 1 second
    setTimeout(() => {
      if (!this.filterReceived) { // Load books only if no search results
        this.loadBooks();
      }
    }, 500);
  }

  private loadBooks(): void {
    this.eBookService.getBooks().subscribe(
      (data: any) => {
        this.eBookItems = data;
      },
      (error: any) => {
        alert(error.message);
      }
    ), 2000;
  }
}
