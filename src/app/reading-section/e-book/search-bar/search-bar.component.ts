import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  directsearchresults: eBookItem[] = [];
  indirectsearchresults: eBookItem[] = [];
  query: string = "";
  showDialog: boolean = true;
  private routeSub!: Subscription;

  constructor(
    private eBookService: EBookService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      if (this.query) {
        this.fetchSearchResults();
      }
    });
  }

  fetchSearchResults() {
    this.eBookService.get_directSearch(this.query).subscribe(
      (data: any) => {
        this.directsearchresults = data;
      },
      (error: any) => {
        console.error('Error fetching direct search results:', error);
      }
    );

    this.eBookService.get_InDirectSearch(this.query).subscribe(
      (data: any) => {
        this.indirectsearchresults = [];
        for (let index = 0; index < data.length; index++) {
          let indirectBook = data[index];
          let found = this.directsearchresults.some(directBook => directBook.id === indirectBook.id);
          if (!found) {
            this.indirectsearchresults.push(indirectBook);
          }
        }
        this.showDialog = false;
      },
      (error: any) => {
        console.error('Error fetching indirect search results:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
