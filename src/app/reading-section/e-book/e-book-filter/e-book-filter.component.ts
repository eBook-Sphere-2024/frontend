import { Component ,OnInit} from '@angular/core';
import { EBookService } from '../e-book.service';
import { Category } from '../../../../shared/models/Category';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventService } from '../../../../shared/services/EventService';

@Component({
  selector: 'app-e-book-filter',
  templateUrl: './e-book-filter.component.html',
  styleUrls: ['./e-book-filter.component.css']
})
export class EBookFilterComponent implements OnInit {
  listFilter: string = '0';
  filter: any;

  categories: Category[] = [];

  constructor(private eBookService: EBookService, private route: ActivatedRoute, private eventService: EventService) {
  }

  ngOnInit() {
    this.eBookService.getCategories().subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error: any) => {
        alert(error.message);
      }
    );
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.listFilter = id;
        this.updateFilter(id);
      }
    });
  }
  updateFilter(value: any) {
    if (value === '0') {
      // Handle the "All" category case
      this.eBookService.getBooks().subscribe(
        (data: any) => {
          this.filter = data;
          this.eventService.emit('filter', this.filter);
        },
        (error: any) => {
          alert(error.message);
        }
      );
    } else {
      // Filter eBooks by category
      this.eBookService.filter_eBooks_by_category(value).subscribe(
        (data: any) => {
          console.log(data);
          this.filter = data;
          this.eventService.emit('filter', this.filter);
        },
        (error: any) => {
          alert(error.message);
        }
      );
    }
  }
}
