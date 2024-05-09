import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../../e-book/e-book.service';
import { EventService } from '../../../../shared/services/EventService';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  DirectsearchResults: eBookItem[] = [];
  inDirectsearchResults: eBookItem[] = [];
  constructor(private events: EventService, private eBookService: EBookService) { }

  ngOnInit(): void {
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
  }
}
