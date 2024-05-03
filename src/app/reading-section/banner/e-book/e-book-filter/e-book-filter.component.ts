import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventService } from '../../../../../shared/services/EventService';
import { EBookService } from '../e-book.service';
import { Category } from '../../../../../shared/models/Category';

@Component({
  selector: 'app-e-book-filter',
  templateUrl: './e-book-filter.component.html',
  styleUrl: './e-book-filter.component.css'
})

export class EBookFilterComponent {
  listFilter: string = '0';
  @Input() filter: any;
  @Output() filterChange = new EventEmitter<any>();

  constructor(private eBookService: EBookService) { }

  categories: Category[] = []
  // we use it so that when page is loaded we get the first filter
  ngOnInit() {
    this.eBookService.getCategories().subscribe((data: any) => {
      this.categories = data;
    },
      (error: any) => alert(error.message)
    )
  }
  updateFilter(value: any) {
    if (value === '0') {
      // Handle the "All" category case
      this.eBookService.getBooks().subscribe(
        (data: any) => {
          this.filter = data;
          this.filterChange.emit(data);
        },
        (error: any) => {
          alert(error.message);
        }
      );
    } else {
      // Filter eBooks by category
      this.eBookService.filter_eBooks_by_category(value).subscribe(
        (data: any) => {
          this.filter = data;
          this.filterChange.emit(data);
        },
        (error: any) => {
          alert(error.message);
        }
      );
    }

  }
}
