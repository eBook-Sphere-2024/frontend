import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-e-book-details',
  templateUrl: './e-book-details.component.html',
  styleUrls: ['./e-book-details.component.css']
})

export class EBookDetailsComponent implements OnInit {
  eBookItem!: eBookItem;

  constructor(private route: ActivatedRoute, private eBookService: EBookService, private Router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.eBookService.getBookById(id).subscribe(
          (event: any) => {
            this.eBookItem = event;
            console.log(this.eBookItem);
          },
          (error) => {
            console.error('Error fetching eBook details:', error);
          }
        );
      }
    });
  }
  goBack() {
    //go to e-book component
    this.Router.navigate(['ebooks']);
  }
}
