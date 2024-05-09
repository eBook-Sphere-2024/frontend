import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit {
  directsearchresults: eBookItem[] = [];
  indirectsearchresults: eBookItem[] = [];
  query: string = "";
  constructor(
    private eBookService: EBookService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
    });
    if (this.query) {
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
          this.indirectsearchresults = data;
          console.log("indirect", this.indirectsearchresults);
          console.log("indirect length", this.indirectsearchresults.length);
        },
        (error: any) => {
          console.error('Error fetching indirect search results:', error);
        }
      );
    }
  }
}