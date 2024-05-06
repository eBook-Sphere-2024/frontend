import { Component, Input, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-e-book-list',
  templateUrl: './e-book-list.component.html',
  styleUrls: ['./e-book-list.component.css'] // Use styleUrls instead of styleUrl
})
export class EBookListComponent  {
  @Input() eBooks: eBookItem[] = [];

  constructor(private bookService: EBookService) { }

}
