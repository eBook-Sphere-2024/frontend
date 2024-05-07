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
  DirectsearchResults: eBookItem[] = []; // Array to hold search results
  inDirectsearchResults: eBookItem[] = []; // Array to hold search results
  private filterReceived: boolean = false;

  constructor(private events: EventService, private eBookService: EBookService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.events.listen('filter', (eBookItem: any) => {
      this.eBookItems = eBookItem;
      this.filterReceived = true;
    });
    this.events.listen('search', (query: string) => {
      if (query) {
        this.DirectsearchResults = []; // Clear previous search results
        this.inDirectsearchResults = []; // Clear previous search results
        this.eBookService.get_directSearch(query).subscribe(
          (data: any) => {
            console.log(data);
            this.DirectsearchResults = data;
          },
          (error: any) => {
            console.error('Error fetching search results:', error);
          }
        );
        this.eBookService.get_InDirectSearch(query).subscribe(
          (data: any) => {
            console.log("indirect",data);
            this.inDirectsearchResults = data;
          },
          (error: any) => {
            console.error('Error fetching search results:', error);
          }
        );
      }
    });
    // Call loadBooks if filter event is not yet received after 1 second
    setTimeout(() => {
      if (!this.filterReceived && this.DirectsearchResults.length === 0 && this.inDirectsearchResults.length === 0) { // Load books only if no search results
        this.loadBooks();
      }
    }, 3000);
  }

  private loadBooks(): void {
    this.eBookService.getBooks().subscribe(
      (data: any) => {
        this.eBookItems = data;
      },
      (error: any) => {
        alert(error.message);
      }
    ),2000;
  }
}
