import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../shared/models/eBookItem';
import { EBookService } from './e-book.service';
import { EventService } from '../../../shared/services/EventService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-e-book',
  templateUrl: './e-book.component.html',
  styleUrl: './e-book.component.css'
})
export class EBookComponent implements OnInit{
  [x: string]: any;
  category: string="";
  constructor(events: EventService, private eBookService: EBookService,private router:ActivatedRoute) { }
  eBookItems: eBookItem[] = [];
  name: string = "";
  ngOnInit(): void {
    this.eBookService.getBooks().subscribe((data: any) => {
      this.eBookItems = data;
    },
      (error: any) => alert(error.message)
    )
    this.router.paramMap.subscribe(params => {
      this.category = params.get('categoryid') ?? '';
      console.log(this.category)
      this.eBookService.filter_eBooks_by_category(this.category).subscribe(
        (filtered: any) => {
          this.eBookItems = filtered;
        },
        (error: any) => alert(error.message)
      );
    });
  }
}
